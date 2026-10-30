import assert from "node:assert/strict";
import { chromium } from "playwright";
import fs from "node:fs/promises";
const base = process.env.SAMSUNG_TEST_BASE_URL || "http://127.0.0.1:5191";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
    acceptDownloads: true,
  });
  await context.addInitScript(() => {
    if (!localStorage.getItem("test-initialized")) {
      sessionStorage.setItem(
        "qwabi-samsung-launch-session-v1",
        JSON.stringify({
          failed: ["action_wifi_settings"],
          worked: ["action_bluetooth_settings"],
          view: { mode: "phone", group: "all", query: "", scrollY: 0 },
        }),
      );
      localStorage.setItem("private-account-token", "MUST_NOT_UPLOAD");
      localStorage.setItem("test-initialized", "yes");
    }
  });
  let allow = false;
  const received = [];
  const receipt = "12345678-1234-4234-8234-123456789abc";
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/samsung-intent-results", async (route) => {
    const body = route.request().postDataJSON();
    received.push(body);
    assert.equal(JSON.stringify(body).includes("MUST_NOT_UPLOAD"), false);
    await route.fulfill({
      status: allow ? 200 : 503,
      contentType: "application/json",
      body: JSON.stringify(
        allow
          ? {
              ok: true,
              receiptId: receipt,
              acceptedEventIds: body.events.map((event) => event.id),
            }
          : { error: "Temporary failure" },
      ),
    });
  });
  await page.goto(`${base}/samsung-intents`);
  await page
    .getByRole("heading", { name: "Samsung shortcuts", exact: true })
    .waitFor();
  const key = "qwabi-samsung-test-results-v1";
  let ledger = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(ledger.events.length, 2);
  assert.ok(ledger.events.every((event) => event.testedAt === null));
  assert.equal(received.length, 0);
  await page.getByText("Sharing options and download", { exact: true }).click();
  await page.getByRole("checkbox", { name: /After sharing/ }).uncheck();
  await page
    .getByRole("button", { name: "Share test results", exact: true })
    .click();
  await page.getByText("Could not upload yet.", { exact: false }).waitFor();
  ledger = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(ledger.uploaded.length, 0);
  assert.equal(ledger.events.length, 2);
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download a JSON copy" }).click();
  const download = await downloadPromise;
  const file = await download.path();
  const exported = JSON.parse(await fs.readFile(file, "utf8"));
  assert.equal(exported.events.length, 2);
  assert.equal(JSON.stringify(exported).includes("MUST_NOT_UPLOAD"), false);
  allow = true;
  await page.getByRole("checkbox", { name: /After sharing/ }).check();
  await page
    .getByRole("button", { name: "Share test results", exact: true })
    .click();
  await page.getByText(receipt, { exact: true }).waitFor();
  ledger = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(ledger.uploaded.length, 2);
  assert.equal(ledger.sharing, true);
  const wifi = page.locator('[data-shortcut-id="action_wifi_settings"]');
  await wifi.getByRole("button", { name: "Wrong screen", exact: true }).click();
  await page.waitForFunction((key) => {
    const value = JSON.parse(localStorage.getItem(key));
    return (
      value.events.some((event) => event.outcome === "wrong-screen") &&
      value.uploaded.length === value.events.length
    );
  }, key);
  const uploadCount = received.length;
  assert.ok(
    received.some((body) =>
      body.events.some(
        (event) => event.outcome === "wrong-screen" && event.testedAt !== null,
      ),
    ),
  );
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await page
    .getByRole("heading", { name: "Samsung shortcuts", exact: true })
    .waitFor();
  await page.getByText(receipt, { exact: true }).waitFor();
  ledger = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(ledger.events.length, 3);
  assert.equal(ledger.uploaded.length, 3);
  await page
    .getByRole("button", { name: "Pause sharing", exact: true })
    .click();
  await wifi.getByRole("button", { name: "Worked", exact: true }).click();
  await page.waitForTimeout(1600);
  assert.equal(received.length, uploadCount);
  ledger = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(ledger.events.length, 4);
  assert.equal(ledger.uploaded.length, 3);
  assert.equal(ledger.events[3].outcome, "worked");
  assert.deepEqual(errors, []);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  console.log(
    "PASS: recovery of existing marks, no unrelated storage upload, no upload before sharing, offline retention, JSON backup, upload acknowledgement, auto-sync, durable results after session loss and pause sharing.",
  );
  await context.close();
} finally {
  await browser.close();
}
