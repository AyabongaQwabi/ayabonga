import type { ActivityShortcut } from "./samsung-intents";

export const APP_CONTROL_GROUPS = [
  {
    id: "app-controls-management",
    label: "App management",
    description:
      "Installed apps, application manager, cloned apps and defaults.",
  },
  {
    id: "app-controls-settings",
    label: "App settings",
    description:
      "App info, language, defaults, battery, storage and data settings.",
  },
  {
    id: "app-controls-permissions",
    label: "App permissions",
    description:
      "Permission manager, per-app permissions and special app access.",
  },
  {
    id: "app-controls-notifications",
    label: "App notification settings",
    description:
      "App notifications, bubbles, channels, badges and notification access.",
  },
] as const;
export type AppControlGroup = (typeof APP_CONTROL_GROUPS)[number]["id"];
export function isAppControlGroup(value: unknown): value is AppControlGroup {
  return APP_CONTROL_GROUPS.some((group) => group.id === value);
}
export function matchesAppControlGroup(
  item: ActivityShortcut,
  group: AppControlGroup,
): boolean {
  if (item.kind === "app") return false;
  // App info is the shared fallback when a direct settings screen is restricted.
  if (item.action === "android.settings.APPLICATION_DETAILS_SETTINGS")
    return true;
  const text = `${item.name} ${item.action ?? ""} ${item.component ?? ""}`
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
  if (group === "app-controls-management")
    return /applicationsettings|applicationsactivity|applications$|manage(all)?applications|allapplications|clonedapps|defaultapps|appdashboard|appandnotificationdashboard/.test(
      text,
    );
  if (group === "app-controls-notifications")
    return /appnotification|channelnotification|appbubblenotification|notificationapplist|allappsnotification|badgeapp|blocknotificationlist|notification(listener|access|assistant|policy)|manageadaptivenotification/.test(
      text,
    );
  if (group === "app-controls-permissions")
    return /permission|appops|overlay|writesettings|external(source|storage)|appusageaccess|usageaccess|unknownappsources|ignorebatteryoptimization|scheduleexactalarm|alarmsandremindersapp|appinteractacrossprofiles/.test(
      text,
    );
  return (
    Boolean(item.packageInput) ||
    /applicationdetails|appinfo|appstorage|appbattery|appmemory|applocale|appopenbydefault|appusagesettings|appdashboard|useraspectratioapp/.test(
      text,
    )
  );
}
