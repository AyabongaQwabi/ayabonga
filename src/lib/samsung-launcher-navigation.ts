import type { ActivityShortcut } from "./samsung-intents";
import type { GroupSelection } from "./samsung-activity-groups";
import { isSettingsSectionGroup } from "./samsung-settings-sections";
import { isAppControlGroup } from "./app-control-groups";

export const LAUNCHER_MODES = [
  { id: "phone", label: "Phone settings" },
  { id: "app", label: "Manage an app" },
  { id: "apps", label: "Open an app" },
  { id: "advanced", label: "Advanced" },
] as const;
export type LauncherMode = (typeof LAUNCHER_MODES)[number]["id"];
export function validLauncherMode(value: unknown): value is LauncherMode {
  return LAUNCHER_MODES.some((mode) => mode.id === value);
}
// These component names were reported to open Connections rather than the
// named screen on SM-A155F. Preserve them as references; don't offer browser launch.
export function isMisroutingAlias(item: ActivityShortcut): boolean {
  return /(?:^|[./])Settings\$/.test(item.component ?? "");
}
const standardIds = new Set([
  "action_settings",
  "action_wifi_settings",
  "action_bluetooth_settings",
  "action_airplane_mode_settings",
  "action_data_usage_settings",
  "action_nfc_settings",
  "action_nfc_payment_settings",
  "action_vpn_settings",
  "action_apn_settings",
  "action_network_operator_settings",
  "action_display_settings",
  "action_auto_rotate_settings",
  "action_sound_settings",
  "action_battery_saver_settings",
  "action_internal_storage_settings",
  "action_security_settings",
  "action_privacy_settings",
  "action_location_source_settings",
  "action_accessibility_settings",
  "action_device_info_settings",
  "action_date_settings",
  "action_locale_settings",
  "action_input_method_settings",
  "action_application_development_settings",
  "action_manage_applications_settings",
  "action_manage_default_apps_settings",
  "action_all_apps_notification_settings",
  "action_captioning_settings",
  "action_night_display_settings",
  "action_print_settings",
  "action_home_settings",
  "action_application_details_settings",
  "action_app_locale_settings",
  "action_app_open_by_default_settings",
  "action_ignore_background_data_restrictions_settings",
  "action_manage_write_settings",
  "action_manage_overlay_permission",
  "action_manage_unknown_app_sources",
  "action_usage_access_settings",
  "action_ignore_battery_optimization_settings",
  "action_request_schedule_exact_alarm",
  "action_manage_all_files_access_permission",
  "action_manage_app_all_files_access_permission",
  "action_app_notification_settings",
  "action_app_notification_bubble_settings",
  "action_manage_app_use_full_screen_intent",
  "action_notification_listener_settings",
  "action_notification_policy_access_settings",
  "app-controls-notification-channel",
]);
export function isStandardShortcut(item: ActivityShortcut): boolean {
  return (
    !item.component &&
    item.availability === "documented" &&
    standardIds.has(item.id)
  );
}
export function visibleInMode(
  item: ActivityShortcut,
  mode: LauncherMode,
): boolean {
  if (mode === "advanced") return true;
  if (isMisroutingAlias(item)) return false;
  if (mode === "apps") return item.kind === "app";
  if (!isStandardShortcut(item)) return false;
  if (mode === "app") return true;
  return item.kind === "settings" && !item.packageInput && !item.channelInput;
}
export function groupForMode(
  mode: LauncherMode,
  saved?: GroupSelection,
): GroupSelection {
  if (mode === "phone")
    return saved && isSettingsSectionGroup(saved) ? saved : "all";
  if (mode === "app")
    return saved && isAppControlGroup(saved) ? saved : "app-controls-settings";
  if (mode === "apps")
    return saved && ["samsung-apps", "google-apps", "good-lock"].includes(saved)
      ? saved
      : "samsung-apps";
  return saved ?? "all";
}

export function shortcutPriority(
  item: ActivityShortcut,
  mode: LauncherMode,
): number {
  if (mode === "advanced" || mode === "apps") return 0;
  const first =
    mode === "app"
      ? [
          "action_app_notification_settings",
          "action_application_details_settings",
          "action_app_locale_settings",
          "action_app_open_by_default_settings",
        ]
      : [...standardIds];
  const index = first.indexOf(item.id);
  return index < 0 ? 1000 : index;
}
