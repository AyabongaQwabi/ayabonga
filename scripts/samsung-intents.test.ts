import assert from "node:assert/strict";
import { test } from "node:test";
import { execFileSync } from "node:child_process";
import {
  buildAdbCommand,
  buildIntent,
  importComponents,
  SAMSUNG_SHORTCUTS,
} from "../src/lib/samsung-intents";

test("catalog IDs are unique and every shortcut serializes", () => {
  assert.equal(
    new Set(SAMSUNG_SHORTCUTS.map((item) => item.id)).size,
    SAMSUNG_SHORTCUTS.length,
  );
  for (const item of SAMSUNG_SHORTCUTS) {
    assert.match(
      buildIntent(item, "com.android.settings", undefined, "test-channel"),
      /^intent:.*#Intent;.+;end$/,
    );
    assert.match(
      buildAdbCommand(item, "com.android.settings", "test-channel"),
      /^adb shell /,
    );
  }
});
test("package data and extras use Android intent syntax", () => {
  const info = SAMSUNG_SHORTCUTS.find(
    (item) => item.action === "android.settings.APPLICATION_DETAILS_SETTINGS",
  )!;
  assert.equal(
    buildIntent(info, "com.example.app"),
    "intent:com.example.app#Intent;scheme=package;action=android.settings.APPLICATION_DETAILS_SETTINGS;end",
  );
  const notification = SAMSUNG_SHORTCUTS.find(
    (item) => item.action === "android.settings.APP_NOTIFICATION_SETTINGS",
  )!;
  assert.match(
    buildIntent(notification, "com.example.app"),
    /S.android.provider.extra.APP_PACKAGE=com.example.app;/,
  );
  assert.throws(
    () => buildIntent(info, "com.example;action=bad"),
    /valid Android package/,
  );
});
test("fallback is encoded and Samsung background screen includes typed extra", () => {
  const item = SAMSUNG_SHORTCUTS.find(
    (entry) => entry.id === "samsung-sleeping-2",
  )!;
  const uri = buildIntent(
    item,
    "",
    "https://www.qwabi.co.za/samsung-intents?unavailable=a&b=2",
  );
  assert.match(uri, /i.activity_type=2;/);
  assert.match(uri, /S.browser_fallback_url=https%3A%2F%2F/);
  assert.match(buildAdbCommand(item, ""), /--ei/);
});
test("imports preserve nested classes, deduplicate and reject injected syntax", () => {
  const imported = importComponents(
    "com.android.settings/.Settings$WifiSettingsActivity\ncom.android.settings/.Settings$WifiSettingsActivity\nintent:#Intent;action=bad;end\ncom.example.app/.Main;reboot\ncom.example.app/com.example.app.Main",
  );
  assert.equal(imported.length, 2);
  assert.equal(
    imported[0].component,
    "com.android.settings/.Settings$WifiSettingsActivity",
  );
  assert.match(
    buildIntent(imported[0], ""),
    /component=com.android.settings\/.Settings\$WifiSettingsActivity;/,
  );
});
test("ADB preserves dollar signs across local and device shells", () => {
  const item = importComponents(
    "com.android.settings/.Settings$WifiSettingsActivity",
  )[0];
  const command = buildAdbCommand(item, "");
  const remote = execFileSync(
    "sh",
    ["-c", `adb() { shift; printf '%s' "$1"; }; ${command}`],
    { encoding: "utf8" },
  );
  const output = execFileSync(
    "sh",
    ["-c", `am() { printf '%s\\n' "$@"; }; ${remote}`],
    { encoding: "utf8" },
  );
  assert.ok(
    output.includes("com.android.settings/.Settings$WifiSettingsActivity"),
  );
});
