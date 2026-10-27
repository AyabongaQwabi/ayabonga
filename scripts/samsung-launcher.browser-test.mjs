import assert from "node:assert/strict";
import { chromium } from "playwright";
const baseUrl = process.env.SAMSUNG_TEST_BASE_URL || "http://127.0.0.1:5173";
(async () => {
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
        .getByRole("heading", { name: "Your Galaxy.", exact: false })
        .waitFor();
      await page.waitForTimeout(900);
      await page.getByRole("searchbox").fill("Samsung");
      await page
        .getByLabel("Category", { exact: true })
        .selectOption("Samsung apps");
      const card = page.locator(".sl-card").nth(7);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      const id = await card.getAttribute("data-shortcut-id");
      const before = await page.evaluate(() => {
        window.__sameDocumentToken = Math.random();
        return { y: window.scrollY, token: window.__sameDocumentToken };
      });
      const link = card.locator(".sl-card-actions a");
      const uri = await link.getAttribute("href");
      const fallback = decodeURIComponent(
        uri.match(/S.browser_fallback_url=([^;]+)/)[1],
      );
      assert.ok(fallback.includes("#intent-failed="));
      assert.ok(!fallback.includes("?unavailable="));
      await link.evaluate((element) =>
        element.addEventListener(
          "click",
          (event) => {
            event.preventDefault();
            const fallback = decodeURIComponent(
              element.href.match(/S.browser_fallback_url=([^;]+)/)[1],
            );
            queueMicrotask(() => window.location.assign(fallback));
          },
          { capture: true, once: true },
        ),
      );
      await link.click();
      const failed = page.locator(`[data-shortcut-id="${id}"]`);
      await failed.locator(".sl-launch-failed").waitFor();
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => ({
        y: window.scrollY,
        token: window.__sameDocumentToken,
      }));
      assert.equal(before.token, after.token, "fallback must not reload");
      assert.ok(
        Math.abs(before.y - after.y) < 30,
        `fallback scrolled: ${before.y} -> ${after.y}`,
      );
      assert.equal(await page.getByRole("searchbox").inputValue(), "Samsung");
      assert.equal(
        await page.getByLabel("Category", { exact: true }).inputValue(),
        "Samsung apps",
      );
      const persistedY = after.y;
      await page.reload();
      await page
        .getByRole("heading", { name: "Your Galaxy.", exact: false })
        .waitFor();
      await page.waitForTimeout(1100);
      assert.equal(await page.getByRole("searchbox").inputValue(), "Samsung");
      assert.equal(await page.locator(".sl-launch-failed").count(), 1);
      const reloadedY = await page.evaluate(() => window.scrollY);
      assert.ok(
        Math.abs(reloadedY - persistedY) < 30,
        `reload scrolled: ${persistedY} -> ${reloadedY}`,
      );
      await failed.getByRole("button", { name: /Clear failure for/ }).click();
      assert.equal(await page.locator(".sl-launch-failed").count(), 0);
      await failed.getByRole("button", { name: /Mark as failed:/ }).click();
      assert.equal(await page.locator(".sl-launch-failed").count(), 1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      await page.getByRole("button", { name: "Reset failure marks" }).click();
      assert.equal(await page.locator(".sl-launch-failed").count(), 0);
      await page.getByRole("searchbox").fill("App info");
      await page
        .getByLabel("Category", { exact: true })
        .selectOption("All categories");
      await page
        .getByRole("button", { name: /Mark as failed: App info/ })
        .click();
      assert.equal(await page.locator(".sl-launch-failed").count(), 1);
      await page.locator("#sl-package").fill("com.samsung.android.app.notes");
      assert.equal(await page.locator(".sl-launch-failed").count(), 0);
      assert.deepEqual(errors, []);
      console.log(
        `PASS (${reducedMotion}): same document fallback, stable scroll ${Math.round(before.y)}px, filters, red status, reload restore, manual marking, reset and package-specific failures.`,
      );
      await context.close();
    }
    const fresh = await browser.newContext();
    const p = await fresh.newPage();
    await p.goto(`${baseUrl}/samsung-intents`);
    await p
      .getByRole("heading", { name: "Your Galaxy.", exact: false })
      .waitFor();
    assert.equal(await p.locator(".sl-launch-failed").count(), 0);
    assert.equal(await p.getByRole("searchbox").inputValue(), "");
    await fresh.close();
    const denied = await browser.newContext();
    await denied.addInitScript(() =>
      Object.defineProperty(window, "sessionStorage", {
        get() {
          throw new Error("blocked");
        },
      }),
    );
    const d = await denied.newPage();
    await d.goto(`${baseUrl}/samsung-intents`);
    await d
      .getByText("Session storage is unavailable.", { exact: false })
      .waitFor();
    await d
      .getByRole("button", {
        name: "Mark as failed: All settings",
        exact: true,
      })
      .click();
    assert.equal(await d.locator(".sl-launch-failed").count(), 1);
    console.log(
      "PASS: fresh browser sessions clear marks; denied session storage still permits manual failure marking.",
    );
    await denied.close();
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
