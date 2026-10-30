import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowUpRight,
  Copy,
  Download,
  Search,
  Settings2,
  Star,
  Terminal,
  Upload,
  X,
} from "lucide-react";
import { PageShell } from "../components/layout/PageShell";
import { absoluteUrl } from "../lib/site-config";
import {
  buildAdbCommand,
  buildIntent,
  importComponents,
  SAMSUNG_SHORTCUTS,
  validPackage,
  type ActivityShortcut,
} from "../lib/samsung-intents";
import {
  SAMSUNG_SETTINGS_SECTIONS,
  isSettingsSectionGroup,
} from "../lib/samsung-settings-sections";
import {
  APP_CONTROL_GROUPS,
  isAppControlGroup,
} from "../lib/app-control-groups";
import {
  LAUNCHER_MODES,
  groupForMode,
  isMisroutingAlias,
  visibleInMode,
  shortcutPriority,
  type LauncherMode,
} from "../lib/samsung-launcher-navigation";
import { getLenis } from "../lib/lenis";
import {
  ACTIVITY_GROUPS,
  activityGroupInfo,
  matchesActivityGroup,
  type GroupSelection,
} from "../lib/samsung-activity-groups";
import {
  failedLaunchKey,
  launchFallback,
  launchKey,
  launcherScopes as scopes,
  readLaunchSession,
  writeLaunchSession,
  type LauncherScope as Scope,
} from "../lib/samsung-launch-session";
import { useSamsungTestResults } from "../hooks/useSamsungTestResults";
import { SamsungTestResultsPanel } from "../components/SamsungTestResultsPanel";
import { readResults } from "../lib/samsung-test-results";
import { activityCsv, activityStatus, restoreActivityResults, type ActivitySort } from "../lib/samsung-activity-manager";
import "./samsung-intents.css";

const STORAGE_KEY = "qwabi-samsung-launcher-v1";
type SavedState = {
  favourites: string[];
  recent: string[];
  custom: ActivityShortcut[];
};
const emptyState: SavedState = { favourites: [], recent: [], custom: [] };
function readSaved(): SavedState {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!data || typeof data !== "object") return emptyState;
    const ids = (value: unknown) =>
      Array.isArray(value)
        ? value
            .filter((id): id is string => typeof id === "string")
            .slice(0, 1500)
        : [];
    // Rebuild imported entries from components, rather than trusting stored intent fields.
    const components = Array.isArray(data.custom)
      ? data.custom
          .map((item: unknown) =>
            item &&
            typeof item === "object" &&
            "component" in item &&
            typeof item.component === "string"
              ? item.component
              : "",
          )
          .slice(0, 1000)
          .join("\n")
      : "";
    return {
      favourites: ids(data.favourites),
      recent: ids(data.recent).slice(0, 12),
      custom: importComponents(components),
    };
  } catch {
    return emptyState;
  }
}

export default function SamsungIntents() {
  const [saved, setSaved] = useState(readSaved);
  const [initialSession] = useState(() => {
    // Accessing sessionStorage itself can throw in restricted browser modes.
    try {
      const session = readLaunchSession(window.sessionStorage);
      try { return restoreActivityResults(session, readResults(window.localStorage).events); }
      catch { return session; }
    } catch {
      return readLaunchSession({ getItem: () => null });
    }
  });
  const [managerOptions, setManagerOptions] = useState<{ compact: boolean; sort: ActivitySort }>(() => {
    try {
      const value = JSON.parse(localStorage.getItem("qwabi-activity-manager-options-v1") ?? "null");
      return { compact: value?.compact === true, sort: ["recommended", "name", "recent", "status"].includes(value?.sort) ? value.sort : "recommended" };
    } catch { return { compact: false, sort: "recommended" }; }
  });
  useEffect(() => {
    try { localStorage.setItem("qwabi-activity-manager-options-v1", JSON.stringify(managerOptions)); } catch { /* Optional view preferences. */ }
  }, [managerOptions]);
  const [mode, setMode] = useState<LauncherMode>(initialSession.view.mode);
  const [group, setGroup] = useState<GroupSelection>(() =>
    groupForMode(initialSession.view.mode, initialSession.view.group),
  );
  const [query, setQuery] = useState(initialSession.view.query);
  const [category, setCategory] = useState(initialSession.view.category);
  const [scope, setScope] = useState<Scope>(initialSession.view.scope);
  const [targetPackage, setTargetPackage] = useState(
    initialSession.view.targetPackage,
  );
  const [channelId, setChannelId] = useState(initialSession.view.channelId);
  const [failed, setFailed] = useState(initialSession.failed);
  const failedRef = useRef(failed);
  const [worked, setWorked] = useState(initialSession.worked);
  const workedRef = useRef(worked);
  const viewRef = useRef(initialSession.view);
  viewRef.current = {
    mode,
    group,
    query,
    category,
    scope,
    targetPackage,
    channelId,
    scrollY: initialSession.view.scrollY,
  };
  const [sessionUnavailable, setSessionUnavailable] = useState(false);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [android, setAndroid] = useState(false);
  const allShortcuts = useMemo(
    () => [...SAMSUNG_SHORTCUTS, ...saved.custom],
    [saved.custom],
  );
  const testResults = useSamsungTestResults(allShortcuts, { mode, group });
  const recordResult = testResults.record;
  const resultEvents = testResults.ledger.events;
  const activityHistory = useMemo(() => {
    const index = new Map<string, typeof resultEvents>();
    for (const event of resultEvents) {
      index.set(event.launchKey, [...(index.get(event.launchKey) ?? []).slice(-4), event]);
    }
    return index;
  }, [resultEvents]);
  const catalog = useMemo(
    () =>
      allShortcuts
        .filter((item) => visibleInMode(item, mode))
        .sort((a, b) => shortcutPriority(a, mode) - shortcutPriority(b, mode)),
    [allShortcuts, mode],
  );
  const categories = useMemo(
    () => [
      ...new Set(
        catalog
          .filter((item) => matchesActivityGroup(item, group))
          .map((item) => item.category),
      ),
    ],
    [catalog, group],
  );
  const packageValid = validPackage(targetPackage);

  useEffect(() => {
    setAndroid(/Android/i.test(navigator.userAgent));
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }, [saved]);

  const saveSession = useCallback(() => {
    let stored = false;
    try {
      stored = writeLaunchSession(window.sessionStorage, {
        failed: failedRef.current,
        worked: workedRef.current,
        view: { ...viewRef.current, scrollY: window.scrollY },
      });
    } catch {
      /* Storage may be disabled. In-memory session still works. */
    }
    return stored;
  }, []);

  const markFailed = useCallback(
    (
      key: string,
      value: boolean,
      reason:
        "did-not-open" | "wrong-screen" | "browser-fallback" = "did-not-open",
    ) => {
      const next = failedRef.current.filter((id) => id !== key);
      if (value) {
        next.push(key);
        workedRef.current = workedRef.current.filter((id) => id !== key);
        setWorked(workedRef.current);
      }
      failedRef.current = next.slice(-1500);
      setFailed(failedRef.current);
      setSessionUnavailable(!saveSession());
      recordResult(key, value ? reason : "cleared");
    },
    [saveSession, recordResult],
  );

  useEffect(() => {
    setSessionUnavailable(!saveSession());
  }, [
    mode,
    group,
    query,
    category,
    scope,
    targetPackage,
    channelId,
    saveSession,
  ]);

  useEffect(() => {
    const handleFailure = () => {
      const key = failedLaunchKey(window.location.href);
      if (!key) return;
      markFailed(key, true, "browser-fallback");
      const url = new URL(window.location.href);
      if (url.hash.startsWith("#intent-failed=")) url.hash = "";
      url.searchParams.delete("unavailable");
      window.history.replaceState(window.history.state, "", url.href);
      // The red card is the feedback; a floating toast would cover the next button.
      setMessage("");
    };
    handleFailure();
    window.addEventListener("hashchange", handleFailure);
    window.addEventListener("popstate", handleFailure);
    // Save synchronously before a document is unloaded or put into the back cache.
    const save = () => {
      saveSession();
    };
    let scrollTimer: ReturnType<typeof setTimeout>;
    const saveScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(save, 120);
    };
    window.addEventListener("pagehide", save);
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => {
      window.removeEventListener("hashchange", handleFailure);
      window.removeEventListener("popstate", handleFailure);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("scroll", saveScroll);
      clearTimeout(scrollTimer);
    };
  }, [markFailed, saveSession]);

  useEffect(() => {
    // Restore after the shared route's scroll-to-top effect. This also covers
    // browsers that reload a fallback despite its same-document fragment.
    let secondFrame = 0;
    const frame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (initialSession.view.scrollY > 0) {
          const lenis = getLenis();
          if (lenis) {
            // Its cached limit may still describe the short route-loading placeholder.
            lenis.resize();
            lenis.scrollTo(initialSession.view.scrollY, {
              immediate: true,
              force: true,
            });
          } else
            window.scrollTo({
              top: initialSession.view.scrollY,
              behavior: "instant",
            });
        }
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(secondFrame);
    };
  }, [initialSession]);

  const managerCounts = useMemo(() => catalog.reduce((counts, item) => {
    counts[activityStatus(launchKey(item, targetPackage, channelId), worked, failed)]++;
    return counts;
  }, { worked: 0, failed: 0, untested: 0 }), [catalog, worked, failed, targetPackage, channelId]);

  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let list = catalog.filter(
      (item) =>
        matchesActivityGroup(item, group) &&
        (category === "All categories" || item.category === category) &&
        (scope !== "Favourites" || saved.favourites.includes(item.id)) &&
        (scope !== "Recently tried" || saved.recent.includes(item.id)) &&
        (scope !== "Worked" ||
          worked.includes(launchKey(item, targetPackage, channelId))) &&
        (scope !== "Failed" || failed.includes(launchKey(item, targetPackage, channelId))) &&
        (scope !== "Untested" || activityStatus(launchKey(item, targetPackage, channelId), worked, failed) === "untested") &&
        words.every((word) =>
          `${item.name} ${item.category} ${item.action ?? ""} ${item.package ?? ""} ${item.component ?? ""} ${item.description}`
            .toLowerCase()
            .includes(word),
        ),
    );
    if (scope === "Recently tried" || managerOptions.sort === "recent")
      list = list.sort(
        (a, b) => (saved.recent.indexOf(a.id) < 0 ? Infinity : saved.recent.indexOf(a.id)) - (saved.recent.indexOf(b.id) < 0 ? Infinity : saved.recent.indexOf(b.id)),
      );
    else if (managerOptions.sort === "name") list = list.sort((a, b) => a.name.localeCompare(b.name));
    else if (managerOptions.sort === "status") {
      const rank = { worked: 0, untested: 1, failed: 2 };
      list = list.sort((a, b) => rank[activityStatus(launchKey(a, targetPackage, channelId), worked, failed)] - rank[activityStatus(launchKey(b, targetPackage, channelId), worked, failed)]);
    }
    return list;
  }, [
    catalog,
    failed,
    managerOptions.sort,
    group,
    category,
    query,
    saved.favourites,
    saved.recent,
    scope,
    worked,
    targetPackage,
    channelId,
  ]);

  const groups = useMemo(() => {
    const definitions =
      mode === "phone"
        ? SAMSUNG_SETTINGS_SECTIONS.map(([id, label, description]) => ({
            id: `samsung-section-${id}` as GroupSelection,
            label,
            description,
          }))
        : mode === "app"
          ? [...APP_CONTROL_GROUPS]
          : mode === "apps"
            ? ACTIVITY_GROUPS.filter((entry) =>
                ["samsung-apps", "google-apps", "good-lock"].includes(entry.id),
              )
            : [...ACTIVITY_GROUPS];
    return definitions
      .map((definition) => ({
        ...definition,
        count: catalog.filter((item) =>
          matchesActivityGroup(item, definition.id),
        ).length,
      }))
      .filter((entry) => entry.count > 0);
  }, [catalog, mode]);
  const selectedGroup = groups.find((entry) => entry.id === group);
  const groupedResults = useMemo(() => {
    if (
      (isSettingsSectionGroup(group) || isAppControlGroup(group)) &&
      selectedGroup
    )
      return [{ ...selectedGroup, items: filtered }].filter(
        (entry) => entry.items.length,
      );
    return groups
      .map((definition) => ({
        ...definition,
        items: filtered.filter((item) =>
          matchesActivityGroup(item, definition.id),
        ),
      }))
      .filter((entry) => entry.items.length);
  }, [group, selectedGroup, groups, filtered]);
  function selectGroup(value: GroupSelection) {
    setGroup(value);
    setCategory("All categories");
  }

  function selectMode(value: LauncherMode) {
    setMode(value);
    setGroup(groupForMode(value));
    setCategory("All categories");
    setQuery("");
    setScope("All shortcuts");
    setMessage("");
    setManualCopy("");
  }
  function markWorked(key: string) {
    const wasWorked = workedRef.current.includes(key);
    workedRef.current = workedRef.current.includes(key)
      ? workedRef.current.filter((id) => id !== key)
      : [...workedRef.current, key].slice(-1500);
    failedRef.current = failedRef.current.filter((id) => id !== key);
    setWorked(workedRef.current);
    setFailed(failedRef.current);
    setSessionUnavailable(!saveSession());
    recordResult(key, wasWorked ? "cleared" : "worked");
  }

  function toggleFavourite(id: string) {
    setSaved((old) => ({
      ...old,
      favourites: old.favourites.includes(id)
        ? old.favourites.filter((value) => value !== id)
        : [...old.favourites, id],
    }));
  }
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setMessage("Copied to clipboard.");
      setManualCopy("");
    } catch {
      setManualCopy(value);
      setMessage("Clipboard unavailable. Select and copy the text below.");
    }
  }
  function addComponents() {
    const imported = importComponents(importText);
    if (!imported.length) {
      setMessage(
        "No valid components found. Use one package/activity per line, such as com.android.settings/.Settings.",
      );
      return;
    }
    const merged = new Map(saved.custom.map((item) => [item.id, item]));
    imported.forEach((item) => merged.set(item.id, item));
    if (merged.size > 1000) {
      setMessage("Import up to 1,000 unique activities at a time.");
      return;
    }
    const added = merged.size - saved.custom.length;
    setSaved((old) => ({ ...old, custom: [...merged.values()] }));
    setImportText("");
    setMode("advanced");
    setGroup("my-activities");
    setCategory("All categories");
    setScope("All shortcuts");
    setQuery("");
    setMessage(
      `Added ${added} activities. Duplicate components were skipped; lines that are not components were ignored.`,
    );
  }
  function exportComponents() {
    const url = URL.createObjectURL(
      new Blob([saved.custom.map((item) => item.component).join("\n")], {
        type: "text/plain",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "samsung-activities.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportDirectory() {
    const rows = [["Name", "Category", "Status", "Package", "Action", "Component", "Target app", "Browser launch"]];
    for (const item of filtered) rows.push([
      item.name, item.category, activityStatus(launchKey(item, targetPackage, channelId), worked, failed),
      item.package ?? "", item.action ?? "", item.component ?? "", item.packageInput ? targetPackage : "",
      item.component ? "Reference only" : "Depends on Android activity access",
    ]);
    const url = URL.createObjectURL(new Blob([activityCsv(rows)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "samsung-activity-directory.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(`Exported ${filtered.length} matching activities.`);
  }
  function removeCustom(id: string) {
    setSaved((old) => ({
      custom: old.custom.filter((item) => item.id !== id),
      favourites: old.favourites.filter((value) => value !== id),
      recent: old.recent.filter((value) => value !== id),
    }));
  }

  return (
    <PageShell>
      <Helmet>
        <title>Samsung activity manager | Qwabi</title>
        <meta
          name="description"
          content="Quick access to Samsung apps and Android settings. Search intent shortcuts, save favourites, copy ADB commands and add activities from your Galaxy phone."
        />
        <link rel="canonical" href={absoluteUrl("/samsung-intents")} />
      </Helmet>
      <main id="main-content" className={`samsung-launcher ${managerOptions.compact ? "sl-compact" : ""}`} >
        <header className="sl-heading">
          <p className="sl-eyebrow">QWABI / PHONE TOOLS</p>
          <h1>Activity manager</h1>
          <p>Your Samsung activity catalogue, saved shortcuts and test history.</p>
        </header>
        <section className="sl-manager-overview" aria-label="Activity overview">
          {([
            ["All shortcuts", catalog.length, "In this collection"],
            ["Worked", managerCounts.worked, "Confirmed working"],
            ["Failed", managerCounts.failed, "Needs review"],
            ["Untested", managerCounts.untested, "No confirmed result"],
          ] as const).map(([value, count, label]) => (
            <button type="button" key={value} aria-pressed={scope === value} onClick={() => { setScope(value); setGroup("all"); setCategory("All categories"); setQuery(""); }}>
              <strong>{count}</strong><span>{label}</span>
            </button>
          ))}
        </section>
        <p className="sl-manager-caption">Counts cover the selected collection and app target. A launch attempt alone is not a confirmed result.</p>
        <nav className="sl-task-nav" aria-label="What do you want to do?">
          {LAUNCHER_MODES.map((entry) => (
            <button
              type="button"
              key={entry.id}
              aria-pressed={mode === entry.id}
              onClick={() => selectMode(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </nav>
        <p className="sl-simple-notice">
          {mode === "advanced"
            ? "Reference archive: internal and historical intents may be missing, blocked or misrouted. Browser launch is disabled for reported Settings$ aliases."
            : "Opening a screen does not confirm the destination. Mark Worked only if it is correct."}
        </p>
        {storageUnavailable && (
          <p className="sl-feedback" role="status">
            Browser storage is unavailable. Favourites and imported activities
            will last for this visit only.
          </p>
        )}

        {sessionUnavailable && (
          <p className="sl-feedback" role="status">
            Session storage is unavailable. Failure marks work on this page, but
            may be lost after a reload.
          </p>
        )}
        <div className="sl-session-bar">
          <span role="status">
            {failed.length} failed{" "}
            {failed.length === 1 ? "result" : "results"} saved in this browser
          </span>
          <button
            type="button"
            disabled={!failed.length}
            onClick={() => {
              for (const key of failedRef.current) recordResult(key, "cleared");
              failedRef.current = [];
              setFailed([]);
              setSessionUnavailable(!saveSession());
            }}
          >
            Reset failure marks
          </button>
        </div>
        <SamsungTestResultsPanel results={testResults} />
        {(mode === "app" || mode === "advanced") && (
          <>
            <div className="sl-app-target">
              <Settings2 size={18} aria-hidden="true" />
              <label htmlFor="sl-app-choice">App</label>
              <select
                id="sl-app-choice"
                value={
                  [
                    "com.android.settings",
                    ...SAMSUNG_SHORTCUTS.filter(
                      (item) => item.kind === "app",
                    ).map((item) => item.package),
                  ].includes(targetPackage)
                    ? targetPackage
                    : "__custom"
                }
                onChange={(event) =>
                  setTargetPackage(
                    event.target.value === "__custom" ? "" : event.target.value,
                  )
                }
              >
                <option value="com.android.settings">Settings</option>
                {SAMSUNG_SHORTCUTS.filter((item) => item.kind === "app").map(
                  (item) => (
                    <option key={item.id} value={item.package}>
                      {item.name}
                    </option>
                  ),
                )}
                <option value="__custom">Another app…</option>
              </select>
              <details
                className="sl-package-details"
                open={!validPackage(targetPackage) || undefined}
              >
                <summary>Package name</summary>
                <input
                  id="sl-package"
                  aria-label="App package name"
                  value={targetPackage}
                  onChange={(event) =>
                    setTargetPackage(event.target.value.trim())
                  }
                  spellCheck={false}
                  aria-invalid={!packageValid}
                />
              </details>
            </div>
            {(mode === "advanced" ||
              group === "app-controls-notifications") && (
              <div className="sl-app-target sl-channel-target">
                <label htmlFor="sl-channel">
                  Notification channel ID (optional)
                </label>
                <input
                  id="sl-channel"
                  value={channelId}
                  onChange={(event) => setChannelId(event.target.value)}
                  maxLength={2000}
                  spellCheck={false}
                  placeholder="Actual channel ID from the app"
                  aria-describedby="sl-channel-help"
                />
                <span id="sl-channel-help">
                  Only needed for channel-specific notification settings. Leave
                  blank for all app notifications.
                </span>
              </div>
            )}
          </>
        )}

        <section className="sl-task-controls" aria-label="Choose a destination">
          <label className="sl-group-select-label">
            <span>
              {mode === "phone"
                ? "Settings section"
                : mode === "app"
                  ? "What do you want to manage?"
                  : mode === "apps"
                    ? "App collection"
                    : "Reference group"}
            </span>
            <select
              aria-label="Activity group"
              value={group}
              onChange={(event) =>
                selectGroup(event.target.value as GroupSelection)
              }
            >
              <option value="all">{mode === "phone" ? "All phone settings" : mode === "app" ? "All app controls" : "All entries"}</option>
              {groups.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
          {mode === "app" && (
            <p>
              Choose your app below. For permissions, open App info and then tap
              Permissions if the direct screen is unavailable.
            </p>
          )}
          {mode === "apps" && (
            <p>
              These apps must be installed. Android may block opening an app
              from the browser.
            </p>
          )}
        </section>
        <section className="sl-directory" aria-label="Activity directory">
          <div className="sl-toolbar">
            <label className="sl-search">
              <Search size={21} aria-hidden="true" />
              <span className="sr-only">Search activities</span>
              <input
                type="search"
                placeholder="Search settings, apps, packages…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={18} />
                </button>
              )}
            </label>
            {mode === "advanced" && (
              <a className="sl-import-link" href="#my-activities">
                <Upload size={17} aria-hidden="true" /> Add activities
              </a>
            )}
          </div>
          <div className="sl-manager-tools">
            <label>Sort activities
              <select aria-label="Sort activities" value={managerOptions.sort} onChange={event => setManagerOptions(old => ({ ...old, sort: event.target.value as ActivitySort }))}>
                <option value="recommended">Recommended</option><option value="name">Name A–Z</option><option value="recent">Recently tried first</option><option value="status">Working first</option>
              </select>
            </label>
            <button type="button" aria-pressed={managerOptions.compact} onClick={() => setManagerOptions(old => ({ ...old, compact: !old.compact }))}>{managerOptions.compact ? "Comfortable view" : "Compact view"}</button>
            <button type="button" onClick={exportDirectory} disabled={!filtered.length}><Download size={15} aria-hidden="true" /> Export {filtered.length} as CSV</button>
          </div>
          <div className="sl-filter-row">
            <div
              className="sl-scopes"
              role="group"
              aria-label="Shortcut collection"
            >
              {scopes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={scope === value}
                    onClick={() => setScope(value)}
                  >
                    {value === "Favourites" && (
                      <Star size={14} aria-hidden="true" />
                    )}
                    {value === "All shortcuts"
                      ? "All"
                      : value === "Favourites"
                        ? "Saved"
                        : value}
                    {value === "Favourites" && (
                      <span>{saved.favourites.length}</span>
                    )}
                  </button>
                ))}
            </div>
            {mode === "advanced" && (
              <label className="sl-category">
                <span className="sr-only">Category</span>
                <select
                  aria-label="Category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option>All categories</option>
                  {categories.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
          <div className="sl-results-heading">
            <h2>
              {scope === "All shortcuts"
                ? category === "All categories"
                  ? (selectedGroup?.label ??
                    (mode === "phone"
                      ? "Phone settings"
                      : mode === "apps"
                        ? "Apps"
                        : mode === "advanced"
                          ? "Reference archive"
                          : "App settings"))
                  : category
                : scope}
            </h2>
            <span aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "result" : "results"}
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="sl-empty">
              <Search size={30} aria-hidden="true" />
              <h3>
                {scope === "Favourites"
                  ? "Keep your essentials close."
                  : "No shortcuts here yet."}
              </h3>
              <p>
                {scope === "Favourites"
                  ? "Tap the star on any shortcut to save it here."
                  : "Try another group, search or category, or add exact components from your phone."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All categories");
                  setScope("All shortcuts");
                  setGroup(groupForMode(mode));
                }}
              >
                Show all shortcuts
              </button>
            </div>
          ) : (
            <div className="sl-group-results">
              {groupedResults.map((resultGroup) => (
                <section
                  key={resultGroup.id}
                  aria-labelledby={`sl-results-${resultGroup.id}`}
                >
                  <h3
                    className="sl-group-results-title"
                    id={`sl-results-${resultGroup.id}`}
                  >
                    {resultGroup.label}
                    <span>
                      {resultGroup.items.length}{" "}
                      {mode === "advanced" ? "references" : "shortcuts"}
                    </span>
                  </h3>
                  <div className="sl-grid">
                    {resultGroup.items.map((item) => {
                      const disabledReason =
                        item.packageInput && !packageValid
                          ? "Enter a valid target app package first."
                          : item.channelInput && !channelId.trim()
                            ? "Enter the actual notification channel ID above."
                            : "";
                      const browserBlocked = Boolean(item.component);
                      const misroutes = isMisroutingAlias(item);
                      const disabled = Boolean(disabledReason);
                      const itemName =
                        mode === "app" &&
                        item.id === "action_application_details_settings" &&
                        group === "app-controls-permissions"
                          ? "App info → Permissions"
                          : mode === "app" &&
                              item.id ===
                                "action_application_details_settings" &&
                              group === "app-controls-notifications"
                            ? "App info → Notifications"
                            : item.name;
                      const sourceUrl =
                        item.sourceUrl ?? activityGroupInfo(item).sourceUrl;
                      const intent = disabled
                        ? ""
                        : buildIntent(
                            item,
                            targetPackage,
                            undefined,
                            channelId,
                          );
                      const key = launchKey(item, targetPackage, channelId);
                      const didFail = failed.includes(key);
                      const didWork = worked.includes(key);
                      const fallback = launchFallback(
                        window.location.href,
                        key,
                      );
                      const launch = disabled
                        ? undefined
                        : buildIntent(item, targetPackage, fallback, channelId);
                      const favourite = saved.favourites.includes(item.id);
                      return (
                        <article
                          className={`sl-card ${didFail ? "sl-card-failed" : ""} ${didWork ? "sl-card-worked" : ""}`}
                          key={item.id}
                          data-shortcut-id={item.id}
                        >
                          <div className="sl-card-top">
                            <span className="sl-card-category">
                              {item.category}
                            </span>
                            <button
                              type="button"
                              className={`sl-star ${favourite ? "is-saved" : ""}`}
                              aria-label={`${favourite ? "Remove" : "Save"} ${item.name} ${favourite ? "from" : "to"} favourites`}
                              aria-pressed={favourite}
                              onClick={() => toggleFavourite(item.id)}
                            >
                              <Star
                                size={19}
                                fill={favourite ? "currentColor" : "none"}
                              />
                            </button>
                          </div>
                          <h3>{itemName}</h3>
                          <div className="sl-card-meta">
                            <span>
                              {didFail
                                ? "Not working on this phone"
                                : didWork
                                  ? "Worked · confirmed by you"
                                  : browserBlocked
                                    ? misroutes
                                      ? "Reported wrong destination"
                                      : "Native activity reference"
                                    : "Not verified on this phone"}
                            </span>
                            {item.packageInput && <span>Target app</span>}
                          </div>
                          {browserBlocked && (
                            <p className="sl-alias-warning">
                              {misroutes
                                ? "Browser opening disabled: reported to show Connections."
                                : "Native activity reference. Browser opening is disabled."}
                            </p>
                          )}
                          <div className="sl-card-actions">
                            {!browserBlocked && (
                              <a
                                href={launch}
                                className={
                                  didFail ? "sl-launch-failed" : undefined
                                }
                                aria-label={`${didFail ? "Try again" : "Try opening"} ${item.name}`}
                                aria-disabled={disabled}
                                onClick={(event) => {
                                  if (disabled) {
                                    event.preventDefault();
                                    setMessage(disabledReason);
                                    return;
                                  }
                                  if (!android) {
                                    event.preventDefault();
                                    setMessage(
                                      "Launch this shortcut from your Samsung phone, or copy its ADB command in Details.",
                                    );
                                    return;
                                  }
                                  setSessionUnavailable(!saveSession());
                                  recordResult(key, "opened");
                                  setSaved((old) => ({
                                    ...old,
                                    recent: [
                                      item.id,
                                      ...old.recent.filter(
                                        (id) => id !== item.id,
                                      ),
                                    ].slice(0, 12),
                                  }));
                                  setMessage("");
                                }}
                              >
                                {didFail ? "Try again" : "Try opening"}{" "}
                                <ArrowUpRight size={17} aria-hidden="true" />
                              </a>
                            )}
                          </div>
                          {!browserBlocked && (
                            <div className="sl-outcome-actions">
                              <button
                                type="button"
                                onClick={() => markWorked(key)}
                                disabled={disabled}
                                aria-pressed={didWork}
                              >
                                Worked
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  markFailed(key, true, "wrong-screen")
                                }
                                disabled={disabled}
                              >
                                Wrong screen
                              </button>
                              <button
                                type="button"
                                className="sl-result-toggle"
                                disabled={disabled}
                                aria-label={`${didFail ? "Clear failure for" : "Mark as failed:"} ${item.name}`}
                                onClick={() => markFailed(key, !didFail)}
                              >
                                {didFail ? "Clear failure mark" : "Didn’t open"}
                              </button>
                            </div>
                          )}
                          <details className="sl-details">
                            <summary>Details &amp; ADB</summary>
                            <p className="sl-identifier">
                              {item.component ?? item.package ?? item.action}
                            </p>
                            {browserBlocked && (
                              <p className="sl-feedback">
                                {misroutes
                                  ? "Reported to open Connections instead of the named screen on SM-A155F."
                                  : "This component has not been verified as a browser-accessible destination."}{" "}
                                Browser launch is disabled. The ADB command is a
                                reference, not a verified destination.
                              </p>
                            )}
                            <p>{item.description}</p>
                            {activityHistory.has(key) && (
                              <div className="sl-activity-history">
                                <h4>Recent tests for this target</h4>
                                <ol>
                                  {[...(activityHistory.get(key) ?? [])].reverse().map(event => (
                                    <li key={event.id}>
                                      <span>{{ opened: "Launch attempted", worked: "Confirmed working", "did-not-open": "Didn’t open", "wrong-screen": "Wrong screen", "browser-fallback": "Browser fallback", cleared: "Mark cleared", "legacy-worked": "Recovered working mark", "legacy-failed": "Recovered failure mark" }[event.outcome]}</span>
                                      <time dateTime={event.recordedAt}>{new Date(event.recordedAt).toLocaleString()}</time>
                                      {event.testedAt === null && <small>Recovery time; original test time unknown</small>}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => void copy(intent)}
                              aria-label={`Copy intent for ${item.name}`}
                            >
                              <Copy size={15} aria-hidden="true" /> Copy intent
                            </button>
                            {sourceUrl && (
                              <p>
                                <a
                                  href={sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  View this group’s source
                                </a>
                              </p>
                            )}
                            {item.packageInput && (
                              <p>
                                Target:{" "}
                                <code>
                                  {targetPackage || "(enter a package above)"}
                                </code>
                              </p>
                            )}
                            {item.channelInput && (
                              <p>
                                Channel:{" "}
                                <code>
                                  {channelId ||
                                    "(enter the actual channel ID above)"}
                                </code>
                              </p>
                            )}
                            <code className="sl-command">
                              {disabled
                                ? disabledReason
                                : buildAdbCommand(
                                    item,
                                    targetPackage,
                                    channelId,
                                  )}
                            </code>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() =>
                                void copy(
                                  buildAdbCommand(
                                    item,
                                    targetPackage,
                                    channelId,
                                  ),
                                )
                              }
                            >
                              <Terminal size={15} aria-hidden="true" /> Copy ADB
                              command
                            </button>
                            {item.kind === "custom" && (
                              <button
                                type="button"
                                className="sl-remove"
                                onClick={() => removeCustom(item.id)}
                              >
                                Remove imported activity
                              </button>
                            )}
                          </details>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>

        {mode === "advanced" && (
          <section
            id="my-activities"
            className="sl-import"
            aria-labelledby="sl-import-title"
          >
            <div>
              <p className="sl-eyebrow">MAKE IT YOURS</p>
              <h2 id="sl-import-title">Add what’s on your phone.</h2>
              <p>
                Samsung’s full activity list changes with your model, carrier,
                installed apps and firmware. Add exact components from your
                device to extend this directory.
              </p>
              <details>
                <summary>How to find activity components</summary>
                <p>
                  With an authorised ADB connection, this command lists launcher
                  activities, not every internal activity:
                </p>
                <code className="sl-command">
                  adb shell cmd package query-activities --brief -a
                  android.intent.action.MAIN -c android.intent.category.LAUNCHER
                </code>
                <button
                  type="button"
                  onClick={() =>
                    void copy(
                      "adb shell cmd package query-activities --brief -a android.intent.action.MAIN -c android.intent.category.LAUNCHER",
                    )
                  }
                >
                  Copy discovery command
                </button>
                <p>
                  For deeper screens, inspect a package with{" "}
                  <code>adb shell dumpsys package com.android.settings</code> or
                  use an activity launcher on your phone. Paste exact
                  package/activity pairs below. Private or permission-protected
                  activities may still refuse to open.
                </p>
              </details>
            </div>
            <div>
              <label htmlFor="sl-import-input">
                One package/activity component per line
              </label>
              <textarea
                id="sl-import-input"
                spellCheck={false}
                maxLength={200000}
                value={importText}
                onChange={(event) => setImportText(event.target.value)}
                placeholder={
                  "com.android.settings/.Settings\ncom.example.app/.MainActivity"
                }
              />
              <div className="sl-import-actions">
                <button
                  type="button"
                  disabled={!importText.trim()}
                  onClick={addComponents}
                >
                  <Upload size={16} aria-hidden="true" /> Import activities
                </button>
                <button
                  type="button"
                  disabled={!saved.custom.length}
                  onClick={exportComponents}
                >
                  <Download size={16} aria-hidden="true" /> Export mine
                </button>
              </div>
              <p className="sl-small">
                Favourites and imports are saved in this browser. Imports
                replace no system settings.
              </p>
            </div>
          </section>
        )}

        <details className="sl-help">
          <summary>
            Compatibility, sources &amp; why a shortcut may not open
          </summary>
          <p>
            The catalog includes Android 16 definitions and historical Samsung
            component variants. The legacy Samsung group is not a One UI 8.5
            inventory. None of these candidates have been validated on your
            specific Galaxy firmware. “Android action” means the action is
            defined in Android, not that its screen is installed, exported or
            browser-accessible. “Device dependent” covers internal Android
            actions, app package targets and imported components. Apps and Good
            Lock modules must be installed separately.
          </p>
          <p>
            Chrome only launches activities that allow browser access, and a tap
            is required. ADB can open some additional exported activities, but
            cannot bypass permissions or private activities. This page cannot
            detect installed apps or confirm launch success. A browser fallback
            marks a shortcut red automatically; silent failures need “Didn’t
            open”. Marks last for this tab’s session and are scoped to the
            target app for per-app settings. Recently tried records requests
            only.
          </p>
          <p>
            Per-app notification shortcuts use an app-package extra; app-info
            and other supported per-app screens use a package URI. Android and
            Samsung may apply additional restrictions to these screens.
          </p>
          <p>
            Sources:{" "}
            <a
              href="https://github.com/aosp-mirror/platform_frameworks_base/blob/android16-release/core/java/android/provider/Settings.java"
              target="_blank"
              rel="noreferrer"
            >
              Android 16 settings source
            </a>
            ,{" "}
            <a
              href="https://developer.android.com/reference/android/provider/Settings"
              target="_blank"
              rel="noreferrer"
            >
              Android settings reference
            </a>
            ,{" "}
            <a
              href="https://developer.chrome.com/docs/android/intents"
              target="_blank"
              rel="noreferrer"
            >
              Chrome intent rules
            </a>
            ,{" "}
            <a
              href="https://developer.samsung.com/mobile/app-management.html"
              target="_blank"
              rel="noreferrer"
            >
              Samsung app management
            </a>
            . Inspired by{" "}
            <a
              href="https://zeldoon.github.io/"
              target="_blank"
              rel="noreferrer"
            >
              Zeldoon’s intent directory
            </a>
            . No affiliation with Samsung.
          </p>
        </details>
        {manualCopy && (
          <div className="sl-manual-copy">
            <label htmlFor="sl-copy-text">Copy manually</label>
            <textarea
              id="sl-copy-text"
              readOnly
              value={manualCopy}
              onFocus={(event) => event.target.select()}
            />
            <button type="button" onClick={() => setManualCopy("")}>
              Close
            </button>
          </div>
        )}
        <div className="sl-toast" role="status" aria-live="polite">
          {message && (
            <>
              <span>{message}</span>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setMessage("")}
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </main>
    </PageShell>
  );
}
