import assert from "node:assert/strict";
import { test } from "node:test";
import { APP_CONTROL_INTENTS } from "../src/data/app-control-intents";
import { APP_CONTROL_GROUPS } from "../src/lib/app-control-groups";
import {
  SAMSUNG_SHORTCUTS,
  buildIntent,
  buildAdbCommand,
} from "../src/lib/samsung-intents";
import {
  matchesActivityGroup,
  validActivityGroup,
} from "../src/lib/samsung-activity-groups";
import {
  launchKey,
  readLaunchSession,
} from "../src/lib/samsung-launch-session";
const find = (id: string) => SAMSUNG_SHORTCUTS.find((item) => item.id === id)!;

test("four app-control collections reuse existing management, settings and notification shortcuts", () => {
  for (const group of APP_CONTROL_GROUPS) {
    assert.ok(validActivityGroup(group.id));
    assert.ok(
      SAMSUNG_SHORTCUTS.some((item) => matchesActivityGroup(item, group.id)),
    );
  }
  assert.ok(
    matchesActivityGroup(
      find("action_application_settings"),
      "app-controls-management",
    ),
  );
  assert.ok(
    matchesActivityGroup(
      find("action_application_details_settings"),
      "app-controls-settings",
    ),
  );
  assert.ok(
    matchesActivityGroup(
      find("action_app_notification_settings"),
      "app-controls-notifications",
    ),
  );
  assert.ok(
    matchesActivityGroup(
      find("action_application_details_settings"),
      "app-controls-permissions",
    ),
  );
  assert.ok(
    matchesActivityGroup(
      find("app-controls-app-permissions"),
      "app-controls-permissions",
    ),
  );
});
test("app permission intents carry both the selected package and the permission name", () => {
  const item = find("app-controls-permission-app-camera");
  const uri = buildIntent(item, "com.example.app");
  assert.match(uri, /S.android.intent.extra.PACKAGE_NAME=com.example.app;/);
  assert.match(
    uri,
    /S.android.intent.extra.PERMISSION_NAME=android.permission.CAMERA;/,
  );
  assert.match(
    buildAdbCommand(item, "com.example.app"),
    /android.intent.extra.PERMISSION_NAME/,
  );
  assert.equal(APP_CONTROL_INTENTS.length, 28);
});
test("channel settings require an ID and encode it independently of package extras", () => {
  const item = find("app-controls-notification-channel");
  assert.throws(() => buildIntent(item, "com.example.app"), /channel ID/);
  assert.throws(
    () => buildAdbCommand(item, "com.example.app", " "),
    /channel ID/,
  );
  const uri = buildIntent(item, "com.example.app", undefined, "news;special");
  assert.match(uri, /S.android.provider.extra.APP_PACKAGE=com.example.app;/);
  assert.match(uri, /S.android.provider.extra.CHANNEL_ID=news%3Bspecial;/);
  assert.match(
    buildAdbCommand(item, "com.example.app", "news;special"),
    /android.provider.extra.CHANNEL_ID/,
  );
  assert.notEqual(
    launchKey(item, "com.example.app", "a"),
    launchKey(item, "com.example.app", "b"),
  );
});
test("app-control group and optional notification channel survive session validation", () => {
  const session = readLaunchSession({
    getItem: () =>
      JSON.stringify({
        view: {
          group: "app-controls-notifications",
          channelId: "news;special",
        },
      }),
  });
  assert.equal(session.view.group, "app-controls-notifications");
  assert.equal(session.view.channelId, "news;special");
});
