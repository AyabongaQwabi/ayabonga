import settings from "../data/samsung-settings.json";

export type ActivityShortcut = {
  id: string;
  name: string;
  category: string;
  kind: "settings" | "app" | "activity" | "custom";
  description: string;
  availability: "documented" | "device";
  source: "android16" | "samsung" | "custom";
  action?: string;
  package?: string;
  component?: string;
  data?: string;
  mimeType?: string;
  integerExtras?: Record<string, number>;
  packageInput?: "data" | "extra" | "intent-extra";
};

// Package launch targets, not a claim that each app exports a browser-accessible activity.
const apps = [
  ["Phone", "com.samsung.android.dialer"],
  ["Contacts", "com.samsung.android.app.contacts"],
  ["Messages", "com.samsung.android.messaging"],
  ["Camera", "com.sec.android.app.camera"],
  ["Gallery", "com.sec.android.gallery3d"],
  ["My Files", "com.sec.android.app.myfiles"],
  ["Clock", "com.sec.android.app.clockpackage"],
  ["Calculator", "com.sec.android.app.popupcalculator"],
  ["Calendar", "com.samsung.android.calendar"],
  ["Samsung Notes", "com.samsung.android.app.notes"],
  ["Voice Recorder", "com.sec.android.app.voicenote"],
  ["Samsung Internet", "com.sec.android.app.sbrowser"],
  ["Galaxy Store", "com.sec.android.app.samsungapps"],
  ["Device care", "com.samsung.android.lool"],
  ["Secure Folder", "com.samsung.knox.securefolder"],
  ["Samsung Pass", "com.samsung.android.samsungpass"],
  ["Samsung Wallet", "com.samsung.android.spay"],
  ["Samsung Health", "com.sec.android.app.shealth"],
  ["Samsung Members", "com.samsung.android.voc"],
  ["SmartThings", "com.samsung.android.oneconnect"],
  ["Smart Switch", "com.sec.android.easyMover"],
  ["Galaxy Wearable", "com.samsung.android.app.watchmanager"],
  ["Modes and Routines", "com.samsung.android.app.routines"],
  ["Bixby", "com.samsung.android.bixby.agent"],
  ["Samsung Find", "com.samsung.android.app.find"],
  ["Samsung Email", "com.samsung.android.email.provider"],
  ["Samsung Music", "com.sec.android.app.music"],
  ["Samsung Flow", "com.samsung.android.galaxycontinuity"],
  ["Samsung Global Goals", "com.samsung.sree"],
  ["Samsung Kids", "com.sec.android.app.kidshome"],
  ["Gaming Hub", "com.samsung.android.game.gamehome"],
  ["Samsung TV Plus", "com.samsung.android.tvplus"],
  ["PENUP", "com.sec.penup"],
  ["Samsung Reminder", "com.samsung.android.app.reminder"],
  ["Samsung Shop", "com.samsung.ecomm.global"],
];
const modules = [
  ["Good Lock", "com.samsung.android.goodlock"],
  ["Home Up", "com.samsung.android.app.homestar"],
  ["LockStar", "com.samsung.systemui.lockstar"],
  ["QuickStar", "com.samsung.android.qstuner"],
  ["Theme Park", "com.samsung.android.themedesigner"],
  ["Keys Cafe", "com.samsung.android.keyscafe"],
  ["Wonderland", "com.samsung.android.wonderland.wallpaper"],
  ["ClockFace", "com.samsung.android.app.clockface"],
  ["NavStar", "com.samsung.systemui.navillera"],
  ["MultiStar", "com.samsung.android.multistar"],
  ["NotiStar", "com.samsung.systemui.notilus"],
  ["RegiStar", "com.samsung.android.app.galaxyregistry"],
  ["One Hand Operation +", "com.samsung.android.sidegesturepad"],
  ["Sound Assistant", "com.samsung.android.soundassistant"],
  ["Nice Catch", "com.samsung.android.app.goodcatch"],
  ["Routines +", "com.samsung.android.app.routineplus"],
  ["Camera Assistant", "com.samsung.android.app.cameraassistant"],
  ["Edge Touch", "com.samsung.android.app.edgetouch"],
];
const googleApps = [
  ["Play Store", "com.android.vending"],
  ["Google Messages", "com.google.android.apps.messaging"],
  ["Google Maps", "com.google.android.apps.maps"],
  ["Gmail", "com.google.android.gm"],
  ["Google Photos", "com.google.android.apps.photos"],
  ["Google Drive", "com.google.android.apps.docs"],
  ["Chrome", "com.android.chrome"],
  ["YouTube", "com.google.android.youtube"],
  ["Google Wallet", "com.google.android.apps.walletnfcrel"],
  ["Digital Wellbeing", "com.google.android.apps.wellbeing"],
];
function appShortcuts(
  entries: string[][],
  category: string,
): ActivityShortcut[] {
  return entries.map(([name, pkg]) => ({
    id: `app-${pkg}`,
    name,
    category,
    kind: "app",
    package: pkg,
    source: "samsung",
    availability: "device",
    description:
      "Opens the app launcher if installed and permitted by your browser. Availability varies by model and region.",
  }));
}

export const SAMSUNG_SHORTCUTS: ActivityShortcut[] = [
  ...(settings as ActivityShortcut[]),
  ...["Sleeping apps", "Deep sleeping apps", "Never sleeping apps"].map(
    (name, activityType): ActivityShortcut => ({
      id: `samsung-sleeping-${activityType}`,
      name,
      category: "Battery & storage",
      kind: "activity",
      action: "com.samsung.android.sm.ACTION_OPEN_CHECKABLE_LISTACTIVITY",
      package: "com.samsung.android.lool",
      integerExtras: { activity_type: activityType },
      source: "samsung",
      availability: "device",
      description:
        "Samsung-documented background usage screen. Browser access and availability depend on your firmware.",
    }),
  ),
  ...appShortcuts(apps, "Samsung apps"),
  ...appShortcuts(modules, "Good Lock"),
  ...appShortcuts(googleApps, "Google apps"),
  ...[
    [
      "camera-photo",
      "Camera (photo)",
      "android.media.action.STILL_IMAGE_CAMERA",
      "Samsung apps",
    ],
    [
      "camera-video",
      "Camera (video)",
      "android.media.action.VIDEO_CAMERA",
      "Samsung apps",
    ],
    ["alarms", "Alarms", "android.intent.action.SHOW_ALARMS", "System"],
    [
      "downloads",
      "Downloads",
      "android.intent.action.VIEW_DOWNLOADS",
      "Battery & storage",
    ],
  ].map(([id, name, action, category]): ActivityShortcut => ({
    id,
    name,
    action,
    category,
    kind: "activity",
    source: "android16",
    availability: "documented",
    description:
      "Standard Android activity action; browser access depends on the receiving app.",
  })),
];

const packagePattern = /^[A-Za-z][\w]*(?:\.[A-Za-z][\w]*)+$/;
const componentPattern =
  /^([A-Za-z][\w]*(?:\.[A-Za-z][\w]*)+)\/(\.?[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)$/;
export function validPackage(value: string): boolean {
  return packagePattern.test(value);
}

/** Android Intent URI grammar: URI data precedes #Intent, string extras are percent-encoded. */
export function buildIntent(
  shortcut: ActivityShortcut,
  targetPackage: string,
  fallbackUrl?: string,
): string {
  if (shortcut.packageInput && !validPackage(targetPackage))
    throw new Error("Enter a valid Android package name.");
  const parts: string[] = [];
  let prefix = "intent:";
  const data =
    shortcut.packageInput === "data"
      ? `package:${targetPackage}`
      : shortcut.data;
  if (data) {
    const colon = data.indexOf(":");
    prefix += data.slice(colon + 1);
    parts.push(`scheme=${data.slice(0, colon)}`);
  }
  parts.push(`action=${shortcut.action ?? "android.intent.action.MAIN"}`);
  if (shortcut.kind === "app")
    parts.push("category=android.intent.category.LAUNCHER");
  if (shortcut.package) parts.push(`package=${shortcut.package}`);
  if (shortcut.component) parts.push(`component=${shortcut.component}`);
  if (shortcut.mimeType)
    parts.push(`type=${encodeURIComponent(shortcut.mimeType)}`);
  if (shortcut.packageInput === "extra")
    parts.push(
      `S.android.provider.extra.APP_PACKAGE=${encodeURIComponent(targetPackage)}`,
    );
  for (const [key, value] of Object.entries(shortcut.integerExtras ?? {}))
    parts.push(`i.${key}=${value}`);
  if (shortcut.packageInput === "intent-extra")
    parts.push(
      `S.android.intent.extra.PACKAGE_NAME=${encodeURIComponent(targetPackage)}`,
    );
  if (fallbackUrl)
    parts.push(`S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`);
  return `${prefix}#Intent;${parts.join(";")};end`;
}
const quoteShell = (value: string) => `'${value.replace(/'/g, `'"'"'`)}'`;
export function buildAdbCommand(
  shortcut: ActivityShortcut,
  targetPackage: string,
): string {
  if (shortcut.packageInput && !validPackage(targetPackage))
    throw new Error("Enter a valid Android package name.");
  const args = [
    "am start",
    "-a",
    quoteShell(shortcut.action ?? "android.intent.action.MAIN"),
  ];
  if (shortcut.kind === "app")
    args.push("-c", "android.intent.category.LAUNCHER");
  if (shortcut.component) args.push("-n", quoteShell(shortcut.component));
  else if (shortcut.package) args.push("-p", quoteShell(shortcut.package));
  const data =
    shortcut.packageInput === "data"
      ? `package:${targetPackage}`
      : shortcut.data;
  if (data) args.push("-d", quoteShell(data));
  if (shortcut.mimeType) args.push("-t", quoteShell(shortcut.mimeType));
  if (shortcut.packageInput === "extra")
    args.push(
      "--es",
      "android.provider.extra.APP_PACKAGE",
      quoteShell(targetPackage),
    );
  for (const [key, value] of Object.entries(shortcut.integerExtras ?? {}))
    args.push("--ei", quoteShell(key), String(value));
  if (shortcut.packageInput === "intent-extra")
    args.push(
      "--es",
      "android.intent.extra.PACKAGE_NAME",
      quoteShell(targetPackage),
    );
  // Quote the remote command too: nested activity classes contain $.
  return `adb shell ${quoteShell(args.join(" "))}`;
}

/** Accept only exact package/class components; arbitrary URIs and commands are never executed. */
export function importComponents(input: string): ActivityShortcut[] {
  const unique = new Map<string, ActivityShortcut>();
  for (const line of input.split(/\r?\n/)) {
    const component = line.trim();
    const match = componentPattern.exec(component);
    if (!match) continue;
    const id = `custom-${component}`;
    unique.set(id, {
      id,
      name: match[2].split(".").pop()!.replace(/\$/g, " › "),
      category: "My activities",
      kind: "custom",
      source: "custom",
      availability: "device",
      component,
      package: match[1],
      description:
        "Imported activity component. Android export rules, permissions and browser restrictions still apply.",
    });
  }
  return [...unique.values()];
}
