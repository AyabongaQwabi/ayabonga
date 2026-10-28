import type { ActivityShortcut } from "./samsung-intents";

export const SAMSUNG_SETTINGS_SECTIONS = [
  [
    "connections",
    "Connections",
    "Wi-Fi, mobile networks, SIM, Bluetooth, NFC and tethering.",
  ],
  [
    "connected-devices",
    "Connected devices",
    "Casting, nearby devices, mirroring and desktop connections.",
  ],
  [
    "modes-routines",
    "Modes and Routines",
    "Automation and routine entry points.",
  ],
  [
    "sounds-vibration",
    "Sounds and vibration",
    "Ringtones, audio effects and volume.",
  ],
  [
    "notifications",
    "Notifications",
    "Notification permissions, history, badges and Do not disturb.",
  ],
  [
    "display",
    "Display",
    "Brightness, fonts, screen timeout and navigation bar.",
  ],
  [
    "wallpaper-style",
    "Wallpaper and style",
    "Wallpaper, appearance and personalisation screens.",
  ],
  ["themes", "Themes", "Theme and theme customisation entry points."],
  [
    "home-screen",
    "Home screen",
    "Default home, launcher and home customisation.",
  ],
  [
    "lock-screen",
    "Lock screen and AOD",
    "Lock-screen appearance, notifications and Smart Lock.",
  ],
  [
    "security-privacy",
    "Security and privacy",
    "Biometrics, credentials, privacy and security screens.",
  ],
  [
    "location",
    "Location",
    "Location access, scanning and satellite location options.",
  ],
  [
    "safety-emergency",
    "Safety and emergency",
    "Emergency and safety entry points, where available.",
  ],
  [
    "accounts-backup",
    "Accounts and backup",
    "Accounts, cloud, sync and migration entry points.",
  ],
  [
    "google",
    "Google",
    "Google account and service entry points in this catalog.",
  ],
  [
    "advanced-features",
    "Advanced features",
    "Gestures, S Pen, multi-window and one-handed operation.",
  ],
  [
    "digital-wellbeing",
    "Digital Wellbeing and parental controls",
    "Wellbeing and focus entry points.",
  ],
  ["device-care", "Device care", "Battery, storage, memory and sleeping apps."],
  ["apps", "Apps", "App info, defaults and special permissions."],
  [
    "general-management",
    "General management",
    "Language, keyboard, date, time and general system settings.",
  ],
  [
    "accessibility",
    "Accessibility",
    "Vision, hearing, interaction and accessibility services.",
  ],
  ["software-update", "Software update", "System update entry points."],
  [
    "about-phone",
    "About phone",
    "Device information, status, licences and legal details.",
  ],
] as const;
export type SamsungSettingsSection =
  (typeof SAMSUNG_SETTINGS_SECTIONS)[number][0];
export type SettingsSectionGroup = `samsung-section-${SamsungSettingsSection}`;
export function isSettingsSectionGroup(
  value: unknown,
): value is SettingsSectionGroup {
  return (
    typeof value === "string" &&
    SAMSUNG_SETTINGS_SECTIONS.some(([id]) => value === `samsung-section-${id}`)
  );
}

// Companion apps that are useful entry points for the corresponding Settings section.
const appSections: Record<string, SamsungSettingsSection> = {
  "com.samsung.android.app.routines": "modes-routines",
  "com.samsung.android.lool": "device-care",
  "com.samsung.knox.securefolder": "security-privacy",
  "com.samsung.android.samsungpass": "security-privacy",
  "com.samsung.android.app.find": "security-privacy",
  "com.sec.android.easyMover": "accounts-backup",
  "com.samsung.android.oneconnect": "connected-devices",
  "com.google.android.apps.wellbeing": "digital-wellbeing",
  "com.samsung.android.themedesigner": "themes",
  "com.samsung.android.app.homestar": "home-screen",
  "com.samsung.systemui.lockstar": "lock-screen",
  "com.samsung.android.soundassistant": "sounds-vibration",
};
export function samsungSettingsSection(
  item: ActivityShortcut,
): SamsungSettingsSection | null {
  if (item.package && appSections[item.package])
    return appSections[item.package];
  if (item.kind === "app") return null;
  const isSettings =
    item.kind === "settings" ||
    item.package === "com.android.settings" ||
    item.id.startsWith("samsung-sleeping-");
  if (!isSettings) return null;
  if (
    item.id.startsWith("app-controls-permission") ||
    item.id === "app-controls-app-permissions" ||
    item.id === "app-controls-settings-permissions"
  )
    return "apps";
  const text = `${item.name} ${item.action ?? ""} ${item.component ?? ""}`
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
  // Specific screens precede broader terms: SIM status belongs in About phone,
  // lock-screen notifications in Lock screen, and overlay permissions in Apps.
  const rules: Array<[RegExp, SamsungSettingsSection]> = [
    [
      /accessibility|caption|magnification|hearing|colorcorrection|colorinversion|contrast|textreading|brightcolors|assistantmenu/,
      "accessibility",
    ],
    [/systemupdate|softwareupdate/, "software-update"],
    [
      /deviceinfo|mydevice|aboutphone|simstatus|simlockstatus|warranty|regulatory|modulelicense|imeibarcode|diagnosticinfo|^status$|settingsstatusactivity/,
      "about-phone",
    ],
    [
      /lockscreen|screenlock|smartlock|alwaysondisplay|aod|ownerinfo/,
      "lock-screen",
    ],
    [/routines|routineplus/, "modes-routines"],
    [/wellbeing|parental|screen*time|focusmode/, "digital-wellbeing"],
    [/emergency|safetycare|safetyinformation/, "safety-emergency"],
    [/account|cloud|syncsettings|backup|easymover/, "accounts-backup"],
    [/google/, "google"],
    [
      /usefulfeature|advancedfeature|multiwindow|multistar|onehand|aircmd|pensettings|finger.*gesture|activekey|motion|gesture|docksettings/,
      "advanced-features",
    ],
    [
      /notification|zenmode|conditionprovider|badgeapp|donotdisturb/,
      "notifications",
    ],
    [/ringtone|sound|audio|volume|vibrat/, "sounds-vibration"],
    [/darktheme|autorotate/, "display"],
    [/wallpaper|style|iconbackground/, "wallpaper-style"],
    [/theme/, "themes"],
    [/home|launcher/, "home-screen"],
    [
      /cast|nearby|wifidisplay|p2p|mirroring|dexsettings|connecteddevice|devicevisibility/,
      "connected-devices",
    ],
    [/location|satelliteview|agps/, "location"],
    [
      /bluetooth|wireless|wifi|network|apnsettings|roaming|tether|nfc|airplane|simsettings|simprofiles|datasaver|datausage|billingcycle|mobile|satellitesetting|gigamulti/,
      "connections",
    ],
    [
      /battery|sleeping|storage|memory|power|boostmode|backgroundcheck/,
      "device-care",
    ],
    [
      /security|privacy|fingerprint|biometric|iris|face|credential|knox|crypt|smartscan|personalpage|trust/,
      "security-privacy",
    ],
    [
      /display|brightness|screen|font|navigationbar|night|bluelight|colorbalance|color.*mode|modepreview|hdreffect/,
      "display",
    ],
    [
      /app|permission|overlay|write.*settings|usageaccess|external.*source|scheduleexact|vrlistener/,
      "apps",
    ],
  ];
  for (const [pattern, section] of rules)
    if (pattern.test(text)) return section;
  return "general-management";
}
