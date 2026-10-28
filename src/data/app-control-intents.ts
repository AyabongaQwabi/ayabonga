import type { ActivityShortcut } from "../lib/samsung-intents";
const intentSource =
  "https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/content/Intent.java";
const settingsSource =
  "https://developer.android.com/reference/android/provider/Settings";
const base = {
  kind: "settings",
  source: "android16",
  availability: "device",
  category: "Apps & permissions",
} as const;
const permissions = [
  ["camera", "Camera", "android.permission.CAMERA"],
  ["microphone", "Microphone", "android.permission.RECORD_AUDIO"],
  ["location", "Location", "android.permission.ACCESS_FINE_LOCATION"],
  ["contacts", "Contacts", "android.permission.READ_CONTACTS"],
  ["calendar", "Calendar", "android.permission.READ_CALENDAR"],
  ["phone", "Phone", "android.permission.CALL_PHONE"],
  ["sms", "SMS", "android.permission.READ_SMS"],
  ["nearby", "Nearby devices", "android.permission.BLUETOOTH_SCAN"],
  ["photos", "Photos", "android.permission.READ_MEDIA_IMAGES"],
  ["videos", "Videos", "android.permission.READ_MEDIA_VIDEO"],
  ["audio", "Music and audio", "android.permission.READ_MEDIA_AUDIO"],
  ["notifications", "Notifications", "android.permission.POST_NOTIFICATIONS"],
];
export const APP_CONTROL_INTENTS: ActivityShortcut[] = [
  {
    ...base,
    id: "app-controls-permission-manager",
    name: "Permission manager (all apps)",
    action: "android.intent.action.MANAGE_PERMISSIONS",
    sourceUrl: intentSource,
    description:
      "Internal Android permission-manager activity. Browser and permission-controller restrictions may block this entry point.",
  },
  {
    ...base,
    id: "app-controls-app-permissions",
    name: "App permissions (selected app)",
    action: "android.intent.action.MANAGE_APP_PERMISSIONS",
    packageInput: "intent-extra",
    sourceUrl: intentSource,
    description:
      "Legacy internal app-permissions entry point using the selected app package. May be blocked; App info → Permissions is the normal fallback.",
  },
  {
    ...base,
    id: "app-controls-settings-permissions",
    name: "App permissions (Android settings variant)",
    action: "android.settings.APP_PERMISSIONS_SETTINGS",
    packageInput: "intent-extra",
    sourceUrl: settingsSource,
    description:
      "Android internal app-permissions settings action. Requires privileged LAUNCH_PERMISSION_SETTINGS access and is expected to be blocked from an ordinary browser.",
  },
  ...permissions.flatMap(([id, name, permission]): ActivityShortcut[] => [
    {
      ...base,
      id: `app-controls-permission-apps-${id}`,
      name: `${name} permission · all apps`,
      action: "android.intent.action.MANAGE_PERMISSION_APPS",
      stringExtras: { "android.intent.extra.PERMISSION_NAME": permission },
      sourceUrl: intentSource,
      description:
        "Internal permission-controller screen listing apps for this permission. It may require a privileged caller; support varies by firmware.",
    },
    {
      ...base,
      id: `app-controls-permission-app-${id}`,
      name: `${name} permission · selected app`,
      action: "android.intent.action.MANAGE_APP_PERMISSION",
      packageInput: "intent-extra",
      stringExtras: { "android.intent.extra.PERMISSION_NAME": permission },
      sourceUrl: intentSource,
      description:
        "Internal per-app permission screen. Requires privileged GRANT_RUNTIME_PERMISSIONS access and is expected to be blocked in an ordinary browser. It does not grant permissions automatically.",
    },
  ]),
  {
    ...base,
    id: "app-controls-notification-channel",
    name: "App notification channel settings",
    category: "Notifications",
    action: "android.settings.CHANNEL_NOTIFICATION_SETTINGS",
    packageInput: "extra",
    channelInput: true,
    sourceUrl: settingsSource,
    availability: "documented",
    description:
      "Opens one notification channel for the selected app. Enter the actual channel ID used by that app, not its displayed channel name. App notifications is the fallback if the ID is unknown.",
  },
];
