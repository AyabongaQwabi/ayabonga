import assert from "node:assert/strict";
import { test } from "node:test";
import {
  SAMSUNG_SHORTCUTS,
  buildAdbCommand,
  buildIntent,
  importComponents,
} from "../src/lib/samsung-intents";
import {
  ACTIVITY_GROUPS,
  shortcutGroup,
  validActivityGroup,
} from "../src/lib/samsung-activity-groups";
import { readLaunchSession } from "../src/lib/samsung-launch-session";

test("expanded catalog has distinct groups for action, component, app and Samsung variants", () => {
  assert.ok(SAMSUNG_SHORTCUTS.length > 500);
  for (const item of SAMSUNG_SHORTCUTS)
    assert.ok(validActivityGroup(shortcutGroup(item)));
  for (const group of ACTIVITY_GROUPS.filter(
    (entry) => entry.id !== "my-activities",
  )) {
    assert.ok(
      SAMSUNG_SHORTCUTS.some((entry) => shortcutGroup(entry) === group.id),
      `${group.id} should have candidates`,
    );
  }
  assert.equal(
    shortcutGroup(
      SAMSUNG_SHORTCUTS.find((entry) => entry.id === "action_settings")!,
    ),
    "android-settings",
  );
  assert.equal(
    shortcutGroup(
      SAMSUNG_SHORTCUTS.find((entry) => entry.id === "samsung-sleeping-0")!,
    ),
    "samsung-activities",
  );
});

test("explicit component candidates are unique, correctly qualified and marked experimental", () => {
  const components = SAMSUNG_SHORTCUTS.filter((item) => item.component);
  assert.equal(
    new Set(components.map((item) => item.component)).size,
    components.length,
  );
  for (const item of components) {
    assert.match(
      item.component!,
      /^com\.android\.settings\/com\.(android|samsung)\./,
    );
    assert.equal(item.availability, "device");
    assert.doesNotMatch(
      item.component!,
      /Reset|Factory|Erase|Wipe|Remove|Uninstall|Reboot|Shutdown/i,
    );
  }
});

test("document picker categories and MIME type serialize for Android and ADB", () => {
  const item = SAMSUNG_SHORTCUTS.find(
    (entry) => entry.id === "android-common-files-open",
  )!;
  assert.match(
    buildIntent(item, ""),
    /category=android.intent.category.OPENABLE;/,
  );
  assert.match(buildIntent(item, ""), /type=\*%2F\*;/);
  assert.ok(
    buildAdbCommand(item, "").includes("android.intent.category.OPENABLE"),
  );
});

test("imports form their own group with package categories", () => {
  const [item] = importComponents("com.example.app/.Settings");
  assert.equal(shortcutGroup(item), "my-activities");
  assert.equal(item.category, "com.example.app");
});

test("session migration and validation preserve only known group selections", () => {
  assert.equal(
    readLaunchSession({ getItem: () => null }).view.group,
    "android-settings",
  );
  assert.equal(
    readLaunchSession({
      getItem: () => JSON.stringify({ view: { group: "samsung-legacy" } }),
    }).view.group,
    "samsung-legacy",
  );
  assert.equal(
    readLaunchSession({
      getItem: () => JSON.stringify({ view: { group: "injected" } }),
    }).view.group,
    "android-settings",
  );
  assert.equal(
    readLaunchSession({
      getItem: () => JSON.stringify({ view: { group: "all" } }),
    }).view.group,
    "all",
  );
});
