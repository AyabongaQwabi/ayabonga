import assert from "node:assert/strict";
import { test } from "node:test";
import { randomUUID } from "node:crypto";
import { SAMSUNG_SHORTCUTS } from "../src/lib/samsung-intents";
import {
  freshLedger,
  recoverStoredResults,
  recordTestResult,
  createResultsBatch,
  pendingResults,
  persistResults,
  readResults,
  RESULTS_KEY,
} from "../src/lib/samsung-test-results";
import { validateResultsBatch } from "../src/lib/samsung-test-results-schema";
import {
  encryptResults,
  decryptResults,
} from "../api/lib/_samsung-results-store";
import { handleSamsungResults } from "../api/samsung-intent-results";
function batch() {
  return validateResultsBatch(
    createResultsBatch(
      recordTestResult(
        freshLedger(),
        "action_wifi_settings",
        "wrong-screen",
        SAMSUNG_SHORTCUTS,
        { mode: "phone", group: "all" },
      ),
      "Test browser",
    ),
  );
}

test("old session marks and local legacy marks recover without reading other storage keys or inventing test times", () => {
  const readKeys: string[] = [];
  const local = {
    getItem: (key: string) => {
      readKeys.push(key);
      if (key === "qwabi-samsung-launcher-v1")
        return JSON.stringify({
          worked: ["action_bluetooth_settings"],
          unrelatedSecret: "do not upload",
        });
      return null;
    },
  };
  const session = {
    getItem: (key: string) => {
      readKeys.push(key);
      return key === "qwabi-samsung-launch-session-v1"
        ? JSON.stringify({
            failed: ["action_wifi_settings"],
            worked: ["action_display_settings"],
          })
        : null;
    },
  };
  const recovered = recoverStoredResults(
    freshLedger(),
    local,
    session,
    SAMSUNG_SHORTCUTS,
  );
  assert.equal(recovered.events.length, 3);
  assert.equal(
    recovered.events.find((e) => e.shortcutId === "action_wifi_settings")!
      .outcome,
    "legacy-failed",
  );
  assert.ok(recovered.events.every((e) => e.testedAt === null));
  assert.equal(JSON.stringify(recovered).includes("unrelatedSecret"), false);
  assert.equal(
    recoverStoredResults(recovered, local, session, SAMSUNG_SHORTCUTS).events
      .length,
    3,
  );
  assert.ok(
    readKeys.every(
      (key) =>
        key === "qwabi-samsung-launcher-v1" ||
        key === "qwabi-samsung-launch-session-v1",
    ),
  );
});
test("live events keep outcomes, selected package/channel and durable queue state", () => {
  const key =
    "app-controls-notification-channel:com.example.app:channel:news;special";
  let ledger = recordTestResult(
    freshLedger(),
    key,
    "wrong-screen",
    SAMSUNG_SHORTCUTS,
    { mode: "app", group: "app-controls-notifications" },
  );
  assert.equal(ledger.events[0].targetPackage, "com.example.app");
  assert.equal(ledger.events[0].channelId, "news;special");
  assert.equal(ledger.events[0].outcome, "wrong-screen");
  let data = "";
  const storage = {
    getItem: (key: string) => (key === RESULTS_KEY ? data : null),
    setItem: (_key: string, value: string) => {
      data = value;
    },
  };
  assert.equal(persistResults(storage, ledger), true);
  ledger = readResults(storage);
  assert.equal(pendingResults(ledger).length, 1);
  const payload = validateResultsBatch(
    createResultsBatch(ledger, "Test browser"),
  );
  assert.equal(payload.events[0].testedAt, ledger.events[0].recordedAt);
  assert.equal(
    pendingResults({ ...ledger, uploaded: [ledger.events[0].id] }).length,
    0,
  );
});
test("report validation strips unrelated fields, enforces sizes and rejects duplicate event IDs", () => {
  const payload = batch();
  const safe = validateResultsBatch({
    ...payload,
    allLocalStorage: { password: "secret" },
    device: { ...payload.device, imei: "not included" },
    events: payload.events.map((e) => ({ ...e, rawStorage: "not included" })),
  });
  assert.equal(JSON.stringify(safe).includes("not included"), false);
  assert.equal(JSON.stringify(safe).includes("secret"), false);
  assert.throws(
    () =>
      validateResultsBatch({
        ...payload,
        events: [payload.events[0], payload.events[0]],
      }),
    /duplicate/,
  );
  assert.throws(
    () => validateResultsBatch({ ...payload, events: [] }),
    /1 and 100/,
  );
  assert.throws(
    () =>
      validateResultsBatch({
        ...payload,
        events: payload.events.map((e) => ({
          ...e,
          channelId: "x".repeat(2001),
        })),
      }),
    /Invalid/,
  );
});
test("public-store payload is authenticated ciphertext and fails to decrypt with the wrong key or after tampering", () => {
  const payload = batch();
  const envelope = encryptResults(payload, "server-secret");
  assert.equal(
    JSON.stringify(envelope).includes("action_wifi_settings"),
    false,
  );
  assert.deepEqual(decryptResults(envelope, "server-secret"), payload);
  assert.throws(() => decryptResults(envelope, "wrong-secret"));
  assert.throws(() =>
    decryptResults(
      { ...envelope, ciphertext: Buffer.from("changed").toString("base64") },
      "server-secret",
    ),
  );
});
test("API only acknowledges successful storage and rejects other origins, GET and malformed bodies", async () => {
  const req = {
    method: "POST",
    headers: {
      host: "www.qwabi.co.za",
      origin: "https://www.qwabi.co.za",
      "content-type": "application/json",
    },
    body: batch(),
  };
  let stored = 0;
  const saved = await handleSamsungResults(req, async (value) => {
    stored++;
    assert.equal(value.events.length, 1);
    return randomUUID();
  });
  assert.equal(saved.status, 200);
  assert.equal(stored, 1);
  assert.equal(
    (await handleSamsungResults({ ...req, method: "GET" })).status,
    405,
  );
  assert.equal(
    (
      await handleSamsungResults({
        ...req,
        headers: { ...req.headers, origin: "https://other.example" },
      })
    ).status,
    403,
  );
  assert.equal(
    (await handleSamsungResults({ ...req, body: "{broken" })).status,
    400,
  );
  assert.equal(
    (
      await handleSamsungResults(req, async () => {
        throw new Error("offline");
      })
    ).status,
    503,
  );
});
test("unavailable or malformed local storage remains usable and corrupt client identifiers are reset", () => {
  assert.equal(readResults({ getItem: () => "{broken" }).events.length, 0);
  assert.equal(
    readResults({
      getItem: () =>
        JSON.stringify({ version: 1, clientId: "bad", events: [] }),
    }).events.length,
    0,
  );
  assert.equal(
    persistResults(
      {
        setItem: () => {
          throw new Error("blocked");
        },
      },
      freshLedger(),
    ),
    false,
  );
});
