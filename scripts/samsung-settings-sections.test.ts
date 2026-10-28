import assert from "node:assert/strict";
import { test } from "node:test";
import { SAMSUNG_SHORTCUTS } from "../src/lib/samsung-intents";
import {
  matchesActivityGroup,
  validActivityGroup,
} from "../src/lib/samsung-activity-groups";
import {
  SAMSUNG_SETTINGS_SECTIONS,
  samsungSettingsSection,
} from "../src/lib/samsung-settings-sections";
import { readLaunchSession } from "../src/lib/samsung-launch-session";

test("every settings candidate has exactly one Samsung section", () => {
  const settings = SAMSUNG_SHORTCUTS.filter(
    (item) =>
      item.kind === "settings" ||
      item.package === "com.android.settings" ||
      item.id.startsWith("samsung-sleeping-"),
  );
  for (const item of settings) {
    const matches = SAMSUNG_SETTINGS_SECTIONS.filter(([id]) =>
      matchesActivityGroup(item, `samsung-section-${id}`),
    );
    assert.equal(matches.length, 1, item.id);
    assert.ok(samsungSettingsSection(item));
  }
});
test("specific Samsung sections take priority over broad app and network terms", () => {
  const find = (part: string) =>
    SAMSUNG_SHORTCUTS.find((item) => item.component?.endsWith(part))!;
  assert.equal(
    samsungSettingsSection(find("Settings$SimStatusActivity")),
    "about-phone",
  );
  assert.equal(
    samsungSettingsSection(
      find("Settings$LockScreenNotificationsSettingsActivity"),
    ),
    "lock-screen",
  );
  assert.equal(
    samsungSettingsSection(find("Settings$WifiSettingsActivity")),
    "connections",
  );
  assert.equal(
    samsungSettingsSection(find("Settings$AccessibilitySettingsActivity")),
    "accessibility",
  );
  assert.equal(
    samsungSettingsSection(find("Settings$DarkThemeSettingsActivity")),
    "display",
  );
  assert.equal(
    samsungSettingsSection(
      SAMSUNG_SHORTCUTS.find((item) => item.id === "samsung-sleeping-0")!,
    ),
    "device-care",
  );
});
test("section group selection is validated and survives a session round trip", () => {
  assert.ok(validActivityGroup("samsung-section-connections"));
  assert.equal(validActivityGroup("samsung-section-unknown"), false);
  assert.equal(
    readLaunchSession({
      getItem: () =>
        JSON.stringify({ view: { group: "samsung-section-display" } }),
    }).view.group,
    "samsung-section-display",
  );
});
