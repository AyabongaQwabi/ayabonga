import {
  validLauncherMode,
  type LauncherMode,
} from "./samsung-launcher-navigation";
import type { ActivityShortcut } from "./samsung-intents";
import {
  validActivityGroup,
  type GroupSelection,
} from "./samsung-activity-groups";

export const LAUNCH_SESSION_KEY = "qwabi-samsung-launch-session-v1";
export const launcherScopes = [
  "All shortcuts",
  "Favourites",
  "Recently tried",
  "Worked",
  "Failed",
  "Untested",
] as const;
export type LauncherScope = (typeof launcherScopes)[number];
export type LauncherView = {
  mode: LauncherMode;
  group: GroupSelection;
  query: string;
  category: string;
  scope: LauncherScope;
  targetPackage: string;
  channelId: string;
  scrollY: number;
};
export type LauncherSession = {
  failed: string[];
  worked: string[];
  view: LauncherView;
};
const defaultView: LauncherView = {
  mode: "phone",
  group: "android-settings",
  query: "",
  category: "All categories",
  scope: "All shortcuts",
  targetPackage: "com.android.settings",
  channelId: "",
  scrollY: 0,
};

export function readLaunchSession(
  storage: Pick<Storage, "getItem">,
): LauncherSession {
  try {
    const parsed = JSON.parse(storage.getItem(LAUNCH_SESSION_KEY) ?? "null");
    const value = parsed?.view;
    const currentNavigation = validLauncherMode(value?.mode);
    const string = (input: unknown, fallback: string) =>
      typeof input === "string" ? input.slice(0, 2000) : fallback;
    return {
      failed: Array.isArray(parsed?.failed)
        ? [
            ...new Set<string>(
              parsed.failed.filter(
                (key: unknown) => typeof key === "string" && key.length <= 2000,
              ),
            ),
          ].slice(-1500)
        : [],
      worked: Array.isArray(parsed?.worked)
        ? [
            ...new Set<string>(
              parsed.worked.filter(
                (key: unknown) => typeof key === "string" && key.length <= 2000,
              ),
            ),
          ].slice(-1500)
        : [],
      view: {
        mode: validLauncherMode(value?.mode) ? value.mode : "phone",
        group: validActivityGroup(value?.group)
          ? value.group
          : defaultView.group,
        query: currentNavigation ? string(value?.query, defaultView.query) : "",
        category: currentNavigation
          ? string(value?.category, defaultView.category)
          : "All categories",
        scope:
          currentNavigation && launcherScopes.includes(value?.scope)
            ? value.scope
            : defaultView.scope,
        targetPackage: string(value?.targetPackage, defaultView.targetPackage),
        channelId: string(value?.channelId, ""),
        scrollY:
          currentNavigation &&
          Number.isFinite(value?.scrollY) &&
          value.scrollY >= 0
            ? value.scrollY
            : 0,
      },
    };
  } catch {
    return { failed: [], worked: [], view: { ...defaultView } };
  }
}

export function writeLaunchSession(
  storage: Pick<Storage, "setItem">,
  session: LauncherSession,
): boolean {
  try {
    storage.setItem(LAUNCH_SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function launchKey(
  shortcut: ActivityShortcut,
  targetPackage: string,
  channelId = "",
): string {
  // A failure for one app's notification screen must not mark another app's screen.
  if (shortcut.channelInput)
    return `${shortcut.id}:${targetPackage}:channel:${channelId}`;
  return shortcut.packageInput
    ? `${shortcut.id}:${targetPackage}`
    : shortcut.id;
}

export function launchFallback(currentUrl: string, key: string): string {
  const url = new URL(currentUrl);
  url.searchParams.delete("unavailable");
  // A fragment navigation stays in the current document. No matching element ID
  // exists, so the browser has no anchor to scroll to.
  url.hash = `intent-failed=${encodeURIComponent(key)}`;
  return url.href;
}

export function failedLaunchKey(currentUrl: string): string | null {
  const url = new URL(currentUrl);
  try {
    if (url.hash.startsWith("#intent-failed=")) {
      const key = decodeURIComponent(url.hash.slice("#intent-failed=".length));
      return key && key.length <= 2000 ? key : null;
    }
    // Support old intent links while a previous deployment is cached.
    return url.searchParams.get("unavailable");
  } catch {
    return null;
  }
}
