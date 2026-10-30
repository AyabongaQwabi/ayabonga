import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SAMSUNG_SHORTCUTS,
  importComponents,
} from "../src/lib/samsung-intents";
import {
  groupForMode,
  isMisroutingAlias,
  isStandardShortcut,
  visibleInMode,
} from "../src/lib/samsung-launcher-navigation";
import { readLaunchSession } from "../src/lib/samsung-launch-session";

test("reported Settings$ aliases are never normal browser shortcuts, including imported aliases", () => {
  const aliases = [
    ...SAMSUNG_SHORTCUTS,
    ...importComponents("com.android.settings/.Settings$WifiSettingsActivity"),
  ].filter(isMisroutingAlias);
  assert.ok(aliases.length > 200);
  for (const item of aliases) {
    assert.equal(isStandardShortcut(item), false);
    for (const mode of ["phone", "app", "apps"] as const)
      assert.equal(visibleInMode(item, mode), false);
    assert.equal(visibleInMode(item, "advanced"), true);
  }
});
test("normal settings use standard actions and privileged permission intents stay in Advanced", () => {
  for (const item of SAMSUNG_SHORTCUTS.filter((entry) =>
    visibleInMode(entry, "phone"),
  )) {
    assert.equal(item.component, undefined);
    assert.equal(item.availability, "documented");
    assert.equal(item.packageInput, undefined);
  }
  assert.equal(
    visibleInMode(
      SAMSUNG_SHORTCUTS.find(
        (i) => i.id === "app-controls-permission-app-camera",
      )!,
      "app",
    ),
    false,
  );
  assert.equal(
    visibleInMode(
      SAMSUNG_SHORTCUTS.find(
        (i) => i.id === "action_application_details_settings",
      )!,
      "app",
    ),
    true,
  );
});
test("task switching maps old catalog groups to suitable defaults", () => {
  assert.equal(groupForMode("phone", "samsung-legacy"), "all");
  assert.equal(
    groupForMode("phone", "samsung-section-connections"),
    "samsung-section-connections",
  );
  assert.equal(groupForMode("app", "samsung-legacy"), "app-controls-settings");
  assert.equal(groupForMode("apps"), "samsung-apps");
});
test("old navigation resets clutter while keeping failure history; success is explicit", () => {
  const old = readLaunchSession({
    getItem: () =>
      JSON.stringify({
        failed: ["action_settings"],
        view: { group: "samsung-legacy", query: "Settings$", scrollY: 9000 },
      }),
  });
  assert.equal(old.view.mode, "phone");
  assert.equal(old.view.query, "");
  assert.equal(old.view.scrollY, 0);
  assert.deepEqual(old.failed, ["action_settings"]);
  assert.deepEqual(old.worked, []);
  const current = readLaunchSession({
    getItem: () =>
      JSON.stringify({
        worked: ["action_wifi_settings"],
        view: {
          mode: "phone",
          group: "samsung-section-connections",
          query: "Wi-Fi",
          scrollY: 1000,
        },
      }),
  });
  assert.deepEqual(current.worked, ["action_wifi_settings"]);
  assert.equal(current.view.query, "Wi-Fi");
  assert.equal(current.view.scrollY, 1000);
});
