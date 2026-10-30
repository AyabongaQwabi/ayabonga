import assert from "node:assert/strict";
import { chromium } from "playwright";
const baseUrl = process.env.SAMSUNG_TEST_BASE_URL || "http://127.0.0.1:5190";
const browser = await chromium.launch({ headless: true, channel: "chrome" });
try {
  for (const reducedMotion of ["reduce", "no-preference"]) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion,
      userAgent:
        "Mozilla/5.0 (Linux; Android 16; SM-A155F) AppleWebKit/537.36 Chrome/140.0.0.0 Mobile Safari/537.36",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(`${baseUrl}/samsung-intents`);
    await page
      .getByRole("heading", { name: "Activity manager", exact: true })
      .waitFor();
    await page.waitForTimeout(850);
    assert.equal(await page.locator(".sl-task-nav button").count(), 4);
    assert.equal(await page.locator(".sl-group-picker").count(), 0);
    assert.equal(await page.locator("#sl-app-choice").count(), 0);
    assert.equal(
      await page.locator('.sl-card-actions a[href*="component="]').count(),
      0,
    );
    assert.equal(await page.locator(".sl-card-worked").count(), 0);
    await page
      .getByLabel("Activity group", { exact: true })
      .selectOption("samsung-section-connections");
    const wifi = page.locator('[data-shortcut-id="action_wifi_settings"]');
    await wifi.getByRole("button", { name: "Worked", exact: true }).click();
    assert.equal(
      await wifi.locator("..").locator(".sl-card-worked").count(),
      1,
    );
    await wifi
      .getByRole("button", { name: "Wrong screen", exact: true })
      .click();
    assert.ok((await wifi.getAttribute("class")).includes("sl-card-failed"));
    assert.ok(!(await wifi.getAttribute("class")).includes("sl-card-worked"));
    await wifi.getByRole("button", { name: "Worked", exact: true }).click();
    assert.ok((await wifi.getAttribute("class")).includes("sl-card-worked"));
    const card = page.locator(".sl-card").nth(3);
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const id = await card.getAttribute("data-shortcut-id");
    const before = await page.evaluate(() => {
      window.__documentToken = Math.random();
      return { y: scrollY, token: window.__documentToken };
    });
    await card.locator(".sl-card-actions a").evaluate((element) =>
      element.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          const fallback = decodeURIComponent(
            element.href.match(/S.browser_fallback_url=([^;]+)/)[1],
          );
          queueMicrotask(() => location.assign(fallback));
        },
        { capture: true, once: true },
      ),
    );
    await card.locator(".sl-card-actions a").click();
    await page
      .locator(`[data-shortcut-id="${id}"] .sl-launch-failed`)
      .waitFor();
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => ({
      y: scrollY,
      token: window.__documentToken,
    }));
    assert.equal(before.token, after.token);
    assert.ok(Math.abs(before.y - after.y) < 35);
    await page.reload();
    await page
      .getByRole("heading", { name: "Activity manager", exact: true })
      .waitFor();
    await page.waitForTimeout(1000);
    assert.equal(
      await page.getByLabel("Activity group", { exact: true }).inputValue(),
      "samsung-section-connections",
    );
    assert.ok(Math.abs((await page.evaluate(() => scrollY)) - after.y) < 35);
    assert.ok((await wifi.getAttribute("class")).includes("sl-card-worked"));
    await page
      .getByRole("button", { name: "Worked", exact: true })
      .first()
      .click();
    assert.equal(await page.locator(".sl-card").count(), 1);
    await page
      .getByRole("button", { name: "Manage an app", exact: true })
      .click();
    await page
      .locator("#sl-app-choice")
      .selectOption("com.samsung.android.app.notes");
    const appInfo = page.locator(
      '[data-shortcut-id="action_application_details_settings"]',
    );
    assert.match(
      await appInfo.locator(".sl-card-actions a").getAttribute("href"),
      /^intent:com.samsung.android.app.notes#Intent;scheme=package/,
    );
    await page
      .getByLabel("Activity group", { exact: true })
      .selectOption("app-controls-permissions");
    await page
      .getByRole("heading", { name: "App info → Permissions", exact: true })
      .waitFor();
    assert.equal(
      await page
        .locator('[data-shortcut-id="app-controls-permission-app-camera"]')
        .count(),
      0,
    );
    await page
      .getByLabel("Activity group", { exact: true })
      .selectOption("app-controls-notifications");
    const channel = page.locator(
      '[data-shortcut-id="app-controls-notification-channel"]',
    );
    assert.equal(
      await channel.locator(".sl-card-actions a").getAttribute("aria-disabled"),
      "true",
    );
    await page.locator("#sl-channel").fill("news;special");
    assert.match(
      await channel.locator(".sl-card-actions a").getAttribute("href"),
      /CHANNEL_ID=news%3Bspecial;/,
    );
    await channel
      .getByRole("button", { name: "Wrong screen", exact: true })
      .click();
    assert.ok((await channel.getAttribute("class")).includes("sl-card-failed"));
    await page.locator("#sl-channel").fill("another");
    assert.ok(
      !(await channel.getAttribute("class")).includes("sl-card-failed"),
    );
    await page.getByRole("button", { name: "Advanced", exact: true }).click();
    await page
      .getByLabel("Activity group", { exact: true })
      .selectOption("android-components");
    assert.ok((await page.locator(".sl-card").count()) > 100);
    assert.equal(await page.locator(".sl-card-actions a").count(), 0);
    assert.ok((await page.locator(".sl-alias-warning").count()) > 100);
    await page
      .getByLabel("One package/activity component per line")
      .fill(
        "com.android.settings/.Settings$WifiSettingsActivity\ncom.example.app/.MainActivity",
      );
    await page
      .getByRole("button", { name: "Import activities", exact: true })
      .click();
    assert.equal(await page.locator(".sl-card").count(), 2);
    assert.equal(await page.locator(".sl-card-actions a").count(), 0);
    await page
      .getByRole("button", { name: "Open an app", exact: true })
      .click();
    assert.ok((await page.locator(".sl-card").count()) > 20);
    assert.equal(
      await page.locator('.sl-card-actions a[href*="component="]').count(),
      0,
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await page
      .getByRole("button", { name: "Phone settings", exact: true })
      .click();
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(150);
    await page.screenshot({ path: `../task-first-${reducedMotion}.png` });
    assert.deepEqual(errors, []);
    console.log(
      `PASS ${reducedMotion}: task navigation, no normal aliases, explicit success/wrong-screen marks, stable fallback/reload scroll, app picker, permission fallback, channels and non-launchable alias imports.`,
    );
    await context.close();
  }
  const denied = await browser.newContext();
  await denied.addInitScript(() =>
    Object.defineProperty(window, "sessionStorage", {
      get() {
        throw new Error("blocked");
      },
    }),
  );
  const p = await denied.newPage();
  await p.goto(`${baseUrl}/samsung-intents`);
  await p
    .getByText("Session storage is unavailable.", { exact: false })
    .waitFor();
  await p
    .locator('[data-shortcut-id="action_wifi_settings"]')
    .getByRole("button", { name: "Worked", exact: true })
    .click();
  assert.equal(await p.locator(".sl-card-worked").count(), 1);
  await denied.close();
  console.log(
    "PASS: denied session storage leaves manual result tracking usable.",
  );
} finally {
  await browser.close();
}
