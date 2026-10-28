import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LAUNCH_SESSION_KEY,
  failedLaunchKey,
  launchFallback,
  launchKey,
  readLaunchSession,
  writeLaunchSession,
} from "../src/lib/samsung-launch-session";
import { SAMSUNG_SHORTCUTS } from "../src/lib/samsung-intents";

test("fallback uses a same-document fragment, preserving the route and other query parameters", () => {
  const current = "https://www.qwabi.co.za/samsung-intents?mode=test";
  const key = "custom-com.example.app/.Activity$Inner";
  const fallback = launchFallback(current, key);
  assert.equal(fallback.split("#")[0], current);
  assert.equal(failedLaunchKey(fallback), key);
  assert.equal(failedLaunchKey(current), null);
  assert.equal(failedLaunchKey(current + "#intent-failed=%E0%A4%A"), null);
});

test("old fallback links still identify failed shortcuts", () => {
  assert.equal(
    failedLaunchKey(
      "https://example.com/samsung-intents?unavailable=action_settings",
    ),
    "action_settings",
  );
  assert.equal(
    new URL(
      launchFallback(
        "https://example.com/samsung-intents?unavailable=old",
        "new",
      ),
    ).search,
    "",
  );
});

test("failures for per-app settings are scoped to the target package", () => {
  const item = SAMSUNG_SHORTCUTS.find((entry) => entry.packageInput)!;
  assert.notEqual(
    launchKey(item, "com.example.first"),
    launchKey(item, "com.example.second"),
  );
  const root = SAMSUNG_SHORTCUTS.find(
    (entry) => entry.id === "action_settings",
  )!;
  assert.equal(
    launchKey(root, "com.example.first"),
    launchKey(root, "com.example.second"),
  );
});

test("session round trip preserves failures, filters and scroll position", () => {
  let json: string | null = null;
  const storage = {
    getItem: (key: string) => {
      assert.equal(key, LAUNCH_SESSION_KEY);
      return json;
    },
    setItem: (_key: string, value: string) => {
      json = value;
    },
  };
  const session = {
    failed: ["action_settings"],
    view: {
      group: "android-settings" as const,
      query: "wifi",
      category: "Connections",
      scope: "All shortcuts" as const,
      targetPackage: "com.example.app",
      scrollY: 2400,
    },
  };
  assert.equal(writeLaunchSession(storage, session), true);
  assert.deepEqual(readLaunchSession(storage), session);
});

test("corrupt or denied session storage does not break the launcher", () => {
  assert.deepEqual(readLaunchSession({ getItem: () => "{broken" }).failed, []);
  const bad = readLaunchSession({
    getItem: () =>
      JSON.stringify({
        failed: [true, "a", "a"],
        view: { scope: "bad", scrollY: -1 },
      }),
  });
  assert.deepEqual(bad.failed, ["a"]);
  assert.equal(bad.view.scrollY, 0);
  assert.equal(bad.view.scope, "All shortcuts");
  assert.equal(
    writeLaunchSession(
      {
        setItem: () => {
          throw new Error("denied");
        },
      },
      bad,
    ),
    false,
  );
});
