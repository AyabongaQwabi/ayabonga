import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowUpRight,
  Copy,
  Download,
  Search,
  Settings2,
  Smartphone,
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
import { getLenis } from "../lib/lenis";
import {
  ACTIVITY_GROUPS,
  activityGroupInfo,
  shortcutGroup,
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
      return readLaunchSession(window.sessionStorage);
    } catch {
      return readLaunchSession({ getItem: () => null });
    }
  });
  const [group, setGroup] = useState<GroupSelection>(initialSession.view.group);
  const [query, setQuery] = useState(initialSession.view.query);
  const [category, setCategory] = useState(initialSession.view.category);
  const [scope, setScope] = useState<Scope>(initialSession.view.scope);
  const [targetPackage, setTargetPackage] = useState(
    initialSession.view.targetPackage,
  );
  const [failed, setFailed] = useState(initialSession.failed);
  const failedRef = useRef(failed);
  const viewRef = useRef(initialSession.view);
  viewRef.current = {
    group,
    query,
    category,
    scope,
    targetPackage,
    scrollY: initialSession.view.scrollY,
  };
  const [sessionUnavailable, setSessionUnavailable] = useState(false);
  const [importText, setImportText] = useState("");
  const [message, setMessage] = useState("");
  const [manualCopy, setManualCopy] = useState("");
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [android, setAndroid] = useState(false);
  const catalog = useMemo(
    () => [...SAMSUNG_SHORTCUTS, ...saved.custom],
    [saved.custom],
  );
  const categories = useMemo(
    () => [
      ...new Set(
        catalog
          .filter((item) => group === "all" || shortcutGroup(item) === group)
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
        view: { ...viewRef.current, scrollY: window.scrollY },
      });
    } catch {
      /* Storage may be disabled. In-memory session still works. */
    }
    return stored;
  }, []);

  const markFailed = useCallback(
    (key: string, value: boolean) => {
      const next = failedRef.current.filter((id) => id !== key);
      if (value) next.push(key);
      failedRef.current = next.slice(-1500);
      setFailed(failedRef.current);
      setSessionUnavailable(!saveSession());
    },
    [saveSession],
  );

  useEffect(() => {
    setSessionUnavailable(!saveSession());
  }, [group, query, category, scope, targetPackage, saveSession]);

  useEffect(() => {
    const handleFailure = () => {
      const key = failedLaunchKey(window.location.href);
      if (!key) return;
      markFailed(key, true);
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

  const filtered = useMemo(() => {
    const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    let list = catalog.filter(
      (item) =>
        (group === "all" || shortcutGroup(item) === group) &&
        (category === "All categories" || item.category === category) &&
        (scope !== "Favourites" || saved.favourites.includes(item.id)) &&
        (scope !== "Recently tried" || saved.recent.includes(item.id)) &&
        words.every((word) =>
          `${item.name} ${item.category} ${item.action ?? ""} ${item.package ?? ""} ${item.component ?? ""} ${item.description}`
            .toLowerCase()
            .includes(word),
        ),
    );
    if (scope === "Recently tried")
      list = list.sort(
        (a, b) => saved.recent.indexOf(a.id) - saved.recent.indexOf(b.id),
      );
    return list;
  }, [catalog, group, category, query, saved.favourites, saved.recent, scope]);

  const groups = useMemo(
    () =>
      ACTIVITY_GROUPS.map((definition) => ({
        ...definition,
        count: catalog.filter((item) => shortcutGroup(item) === definition.id)
          .length,
      })),
    [catalog],
  );
  const selectedGroup = groups.find((entry) => entry.id === group);
  const groupedResults = useMemo(
    () =>
      groups
        .map((definition) => ({
          ...definition,
          items: filtered.filter(
            (item) => shortcutGroup(item) === definition.id,
          ),
        }))
        .filter((entry) => entry.items.length),
    [groups, filtered],
  );
  function selectGroup(value: GroupSelection) {
    setGroup(value);
    setCategory("All categories");
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
        <title>Samsung activity launcher | Qwabi</title>
        <meta
          name="description"
          content="Quick access to Samsung apps and Android settings. Search intent shortcuts, save favourites, copy ADB commands and add activities from your Galaxy phone."
        />
        <link rel="canonical" href={absoluteUrl("/samsung-intents")} />
      </Helmet>
      <main id="main-content" className="samsung-launcher">
        <header className="sl-hero">
          <div>
            <p className="sl-eyebrow">
              <span className="sl-live-dot" /> QWABI / DEVICE TOOLS
            </p>
            <h1>
              Your Galaxy.
              <br />
              <span>Fewer taps.</span>
            </h1>
            <p className="sl-intro">
              A quick door into your Samsung apps, settings and activities. Find
              a shortcut, make it a favourite, get on with your day.
            </p>
            <div className="sl-tags">
              <span>Samsung Galaxy</span>
              <span>Android shortcuts</span>
              <span>{catalog.length} shortcuts</span>
            </div>
          </div>
          <div className="sl-device" aria-hidden="true">
            <Smartphone size={54} strokeWidth={1} />
            <span>QUICK ACCESS</span>
            <strong>
              One place.
              <br />
              More control.
            </strong>
            <div className="sl-device-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
        </header>

        <div className="sl-notice">
          <Smartphone size={20} aria-hidden="true" />
          <p>
            {android
              ? "Tap Open to try a shortcut on this device."
              : "Open this page on your Galaxy phone to launch shortcuts. You can browse and copy commands here."}{" "}
            Many internal screens cannot open from a browser, even if installed.
            Failed attempts turn red for this session; if nothing happens, tap
            “Didn’t open”. Your position and filters stay in place.
          </p>
        </div>
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
            {failed.length === 1 ? "attempt" : "attempts"} this session
          </span>
          <button
            type="button"
            disabled={!failed.length}
            onClick={() => {
              failedRef.current = [];
              setFailed([]);
              setSessionUnavailable(!saveSession());
            }}
          >
            Reset failure marks
          </button>
        </div>
        <section className="sl-group-picker" aria-labelledby="sl-group-title">
          <div className="sl-group-picker-heading">
            <div>
              <p className="sl-eyebrow">CHOOSE WHAT TO RENDER</p>
              <h2 id="sl-group-title">Explore by activity type</h2>
            </div>
            <label className="sl-group-select-label">
              <span>Activity group</span>
              <select
                aria-label="Activity group"
                value={group}
                onChange={(event) =>
                  selectGroup(event.target.value as GroupSelection)
                }
              >
                <option value="all">All groups ({catalog.length})</option>
                {groups.map((entry) => (
                  <option value={entry.id} key={entry.id}>
                    {entry.label} ({entry.count})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div
            className="sl-group-options"
            role="group"
            aria-label="Activity types"
          >
            {groups.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={group === entry.id}
                onClick={() => selectGroup(entry.id)}
              >
                <span>{entry.label}</span>
                <strong>{entry.count}</strong>
                <small>{entry.description}</small>
              </button>
            ))}
          </div>
          <p className="sl-group-summary">
            {selectedGroup
              ? `${selectedGroup.label}: ${selectedGroup.count} candidates. Only this group is rendered.`
              : `All ${catalog.length} candidates, separated by activity type.`}{" "}
            Search and category filters apply within your selection. These are
            unverified candidates, not a complete list of activities on your
            phone.
          </p>
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
            <a className="sl-import-link" href="#my-activities">
              <Upload size={17} aria-hidden="true" /> Add activities
            </a>
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
                  {value}
                  {value === "Favourites" && (
                    <span>{saved.favourites.length}</span>
                  )}
                </button>
              ))}
            </div>
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
          </div>
          <div className="sl-app-target">
            <Settings2 size={18} aria-hidden="true" />
            <label htmlFor="sl-package">Target app for per-app settings</label>
            <input
              id="sl-package"
              spellCheck={false}
              list="sl-packages"
              value={targetPackage}
              onChange={(event) => setTargetPackage(event.target.value.trim())}
              aria-invalid={!packageValid}
              aria-describedby="sl-package-help"
            />
            <datalist id="sl-packages">
              {SAMSUNG_SHORTCUTS.filter((item) => item.kind === "app").map(
                (item) => (
                  <option key={item.id} value={item.package}>
                    {item.name}
                  </option>
                ),
              )}
            </datalist>
            <span id="sl-package-help">
              {packageValid
                ? "Used by shortcuts marked “Target app”."
                : "Enter a package such as com.samsung.android.app.notes."}
            </span>
          </div>
          <div className="sl-results-heading">
            <h2>
              {scope === "All shortcuts"
                ? category === "All categories"
                  ? (selectedGroup?.label ?? "All activity groups")
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
                  setGroup("all");
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
                    <span>{resultGroup.items.length} candidates</span>
                  </h3>
                  <div className="sl-grid">
                    {resultGroup.items.map((item) => {
                      const disabled = Boolean(
                        item.packageInput && !packageValid,
                      );
                      const intent = disabled
                        ? ""
                        : buildIntent(item, targetPackage);
                      const key = launchKey(item, targetPackage);
                      const didFail = failed.includes(key);
                      const fallback = launchFallback(
                        window.location.href,
                        key,
                      );
                      const launch = disabled
                        ? undefined
                        : buildIntent(item, targetPackage, fallback);
                      const favourite = saved.favourites.includes(item.id);
                      return (
                        <article
                          className={`sl-card ${didFail ? "sl-card-failed" : ""}`}
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
                          <h3>{item.name}</h3>
                          <p className="sl-identifier">
                            {item.component ?? item.package ?? item.action}
                          </p>
                          <div className="sl-card-meta">
                            <span>
                              {didFail
                                ? "Didn’t open this session"
                                : item.availability === "documented"
                                  ? "Android action · untested"
                                  : "Device dependent · untested"}
                            </span>
                            {item.packageInput && <span>Target app</span>}
                          </div>
                          <div className="sl-card-actions">
                            <a
                              href={launch}
                              className={
                                didFail ? "sl-launch-failed" : undefined
                              }
                              aria-label={`${didFail ? "Retry" : "Open"} ${item.name}`}
                              aria-disabled={disabled}
                              onClick={(event) => {
                                if (disabled) {
                                  event.preventDefault();
                                  setMessage(
                                    "Enter a valid target app package first.",
                                  );
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
                              {didFail ? "Retry" : "Open"}{" "}
                              <ArrowUpRight size={17} aria-hidden="true" />
                            </a>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => void copy(intent)}
                              aria-label={`Copy intent for ${item.name}`}
                            >
                              <Copy size={15} aria-hidden="true" /> Copy intent
                            </button>
                          </div>
                          <button
                            type="button"
                            className="sl-result-toggle"
                            disabled={disabled}
                            aria-label={`${didFail ? "Clear failure for" : "Mark as failed:"} ${item.name}`}
                            onClick={() => markFailed(key, !didFail)}
                          >
                            {didFail ? "Clear failure mark" : "Didn’t open"}
                          </button>
                          <details className="sl-details">
                            <summary>Details &amp; ADB</summary>
                            <p>{item.description}</p>
                            {activityGroupInfo(item).sourceUrl && (
                              <p>
                                <a
                                  href={activityGroupInfo(item).sourceUrl}
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
                            <code className="sl-command">
                              {disabled
                                ? "Enter a valid target package above."
                                : buildAdbCommand(item, targetPackage)}
                            </code>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() =>
                                void copy(buildAdbCommand(item, targetPackage))
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
              installed apps and firmware. Add exact components from your device
              to extend this directory.
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
              Favourites and imports are saved in this browser. Imports replace
              no system settings.
            </p>
          </div>
        </section>

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
