import type { ActivityShortcut } from "./samsung-intents";

export const ACTIVITY_GROUPS = [
  {
    id: "android-settings",
    label: "Android settings actions",
    description: "Settings, connections, permissions and system panels.",
    sourceUrl:
      "https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/provider/Settings.java",
  },
  {
    id: "android-components",
    label: "Android settings activities",
    description: "Explicit AOSP screen components. Experimental on Samsung.",
    sourceUrl:
      "https://github.com/aosp-mirror/platform_packages_apps_settings/blob/android16-release/AndroidManifest.xml",
  },
  {
    id: "android-common",
    label: "Everyday Android activities",
    description: "Files, media, contacts, calendars, dialler and composers.",
    sourceUrl: "https://developer.android.com/guide/components/intents-common",
  },
  {
    id: "samsung-apps",
    label: "Samsung apps",
    description: "Launch installed Galaxy apps by package.",
    sourceUrl: undefined,
  },
  {
    id: "samsung-activities",
    label: "Samsung Device care activities",
    description: "Sleeping, deep sleeping and never sleeping apps.",
    sourceUrl: "https://developer.samsung.com/mobile/app-management.html",
  },
  {
    id: "samsung-legacy",
    label: "Samsung settings · legacy",
    description:
      "Historical component variants to try. Not a One UI 8.5 inventory.",
    sourceUrl:
      "https://github.com/GrifoDev/BatMan-ModdedFiles/blob/master/SecSettings/AndroidManifest.xml",
  },
  {
    id: "good-lock",
    label: "Good Lock modules",
    description: "Customisation modules, if installed on your device.",
    sourceUrl: undefined,
  },
  {
    id: "google-apps",
    label: "Google apps",
    description: "Google app package launch targets.",
    sourceUrl: undefined,
  },
  {
    id: "my-activities",
    label: "Imported phone activities",
    description: "Exact components from your phone, filtered by package.",
    sourceUrl: undefined,
  },
] as const;
export type ActivityGroupId = (typeof ACTIVITY_GROUPS)[number]["id"];
export type GroupSelection = ActivityGroupId | "all";
export function validActivityGroup(value: unknown): value is GroupSelection {
  return value === "all" || ACTIVITY_GROUPS.some((group) => group.id === value);
}
export function shortcutGroup(item: ActivityShortcut): ActivityGroupId {
  if (item.group) return item.group;
  if (item.kind === "custom") return "my-activities";
  if (item.kind === "settings") return "android-settings";
  if (item.kind === "app") {
    if (item.category === "Good Lock") return "good-lock";
    if (item.category === "Google apps") return "google-apps";
    return "samsung-apps";
  }
  if (item.id.startsWith("samsung-sleeping-")) return "samsung-activities";
  return "android-common";
}
export function activityGroupInfo(item: ActivityShortcut) {
  return ACTIVITY_GROUPS.find((group) => group.id === shortcutGroup(item))!;
}
