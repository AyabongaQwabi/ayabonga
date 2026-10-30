import { buildIntent, type ActivityShortcut } from "./samsung-intents";
import {
  RESULT_OUTCOMES,
  type SamsungTestEvent,
  type SamsungResultsBatch,
  type ResultOutcome,
  validateResultsBatch,
} from "./samsung-test-results-schema";
export const RESULTS_KEY = "qwabi-samsung-test-results-v1";
export const LAUNCHER_STORAGE_KEYS = [
  "qwabi-samsung-launch-session-v1",
  "qwabi-samsung-launcher-v1",
] as const;
export type ResultsLedger = {
  version: 1;
  clientId: string;
  events: SamsungTestEvent[];
  uploaded: string[];
  sharing: boolean;
  model: string;
  firmware: string;
  lastReceipt: string;
};
const newId = () => crypto.randomUUID();
export const freshLedger = (): ResultsLedger => ({
  version: 1,
  clientId: newId(),
  events: [],
  uploaded: [],
  sharing: false,
  model: "",
  firmware: "",
  lastReceipt: "",
});
export function readResults(
  storage: Pick<Storage, "getItem"> | null,
): ResultsLedger {
  const empty = freshLedger();
  try {
    const raw = JSON.parse(storage?.getItem(RESULTS_KEY) ?? "null");
    if (
      !raw ||
      raw.version !== 1 ||
      typeof raw.clientId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        raw.clientId,
      )
    )
      return empty;
    const events: SamsungTestEvent[] = [];
    for (const event of Array.isArray(raw.events)
      ? raw.events.slice(-20000)
      : []) {
      try {
        events.push(
          validateResultsBatch({
            version: 1,
            clientId: raw.clientId,
            batchId: newId(),
            createdAt: new Date().toISOString(),
            device: {},
            events: [event],
          }).events[0],
        );
      } catch {
        /* Ignore corrupt individual entries. */
      }
    }
    return {
      ...empty,
      clientId: raw.clientId,
      events,
      uploaded: Array.isArray(raw.uploaded)
        ? raw.uploaded
            .filter((id: unknown) => typeof id === "string")
            .slice(-5000)
        : [],
      sharing: raw.sharing === true,
      model: typeof raw.model === "string" ? raw.model.slice(0, 80) : "",
      firmware:
        typeof raw.firmware === "string" ? raw.firmware.slice(0, 100) : "",
      lastReceipt:
        typeof raw.lastReceipt === "string" ? raw.lastReceipt.slice(0, 80) : "",
    };
  } catch {
    return empty;
  }
}
export function persistResults(
  storage: Pick<Storage, "setItem"> | null,
  ledger: ResultsLedger,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(RESULTS_KEY, JSON.stringify(ledger));
    return true;
  } catch {
    return false;
  }
}
export function resultMetadata(
  key: string,
  catalog: ActivityShortcut[],
): Pick<
  SamsungTestEvent,
  | "launchKey"
  | "shortcutId"
  | "name"
  | "action"
  | "component"
  | "targetPackage"
  | "channelId"
> {
  const item = [...catalog]
    .sort((a, b) => b.id.length - a.id.length)
    .find((entry) => key === entry.id || key.startsWith(`${entry.id}:`));
  if (!item)
    return {
      launchKey: key,
      shortcutId: key.slice(0, 2200),
      name: "Older or imported shortcut (metadata unavailable)",
    };
  const suffix = key.slice(item.id.length + 1);
  const [targetPackage, ...channel] = suffix.split(":channel:");
  return {
    launchKey: key,
    shortcutId: item.id,
    name: item.name,
    action: item.action ?? "android.intent.action.MAIN",
    component: item.component,
    ...(item.packageInput ? { targetPackage: targetPackage ?? "" } : {}),
    ...(item.channelInput ? { channelId: channel.join(":channel:") } : {}),
    ...(item.kind === "app" ? { targetPackage: item.package } : {}),
  };
}
export function recoverStoredResults(
  ledger: ResultsLedger,
  local: Pick<Storage, "getItem"> | null,
  session: Pick<Storage, "getItem"> | null,
  catalog: ActivityShortcut[],
): ResultsLedger {
  const events = [...ledger.events];
  const known = new Set(events.map((event) => event.launchKey));
  for (const [storage, source] of [
    [session, "legacy-session"],
    [local, "legacy-local"],
  ] as const) {
    for (const storageKey of LAUNCHER_STORAGE_KEYS) {
      try {
        const value = JSON.parse(storage?.getItem(storageKey) ?? "null");
        for (const [field, outcome] of [
          ["failed", "legacy-failed"],
          ["worked", "legacy-worked"],
        ] as const) {
          for (const key of Array.isArray(value?.[field])
            ? value[field].slice(0, 1500)
            : []) {
            if (
              typeof key !== "string" ||
              !key ||
              key.length > 5000 ||
              known.has(key)
            )
              continue;
            events.push({
              id: newId(),
              recordedAt: new Date().toISOString(),
              testedAt: null,
              outcome,
              source,
              ...resultMetadata(key, catalog),
            });
            known.add(key);
          }
        }
      } catch {
        /* Other website storage keys are deliberately never read. */
      }
    }
  }
  return { ...ledger, events };
}
export function recordTestResult(
  ledger: ResultsLedger,
  key: string,
  outcome: ResultOutcome,
  catalog: ActivityShortcut[],
  context: { mode: string; group: string },
): ResultsLedger {
  if (!RESULT_OUTCOMES.includes(outcome)) return ledger;
  const now = new Date().toISOString();
  const metadata = resultMetadata(key, catalog);
  const shortcut = catalog.find((item) => item.id === metadata.shortcutId);
  let intentUri: string | undefined;
  try {
    if (shortcut) {
      const uri = buildIntent(
        shortcut,
        metadata.targetPackage ?? "",
        undefined,
        metadata.channelId ?? "",
      );
      if (uri.length <= 24000) intentUri = uri;
    }
  } catch {
    /* Missing historical input: retain metadata without fabricating a URI. */
  }
  const event: SamsungTestEvent = {
    id: newId(),
    recordedAt: now,
    testedAt: now,
    outcome,
    source: "live",
    ...metadata,
    ...(intentUri ? { intentUri } : {}),
    ...context,
  };
  // Keep every unsent result. Only prune already-uploaded history when it grows large.
  const uploaded = new Set(ledger.uploaded);
  const retained =
    ledger.events.length >= 5000
      ? ledger.events.filter((entry) => !uploaded.has(entry.id))
      : ledger.events;
  const retainedIds = new Set(retained.map((entry) => entry.id));
  return {
    ...ledger,
    events: [...retained, event],
    uploaded: ledger.uploaded.filter((id) => retainedIds.has(id)),
  };
}
export function pendingResults(ledger: ResultsLedger) {
  const uploaded = new Set(ledger.uploaded);
  return ledger.events.filter((event) => !uploaded.has(event.id));
}
export function createResultsBatch(
  ledger: ResultsLedger,
  browser: string,
): SamsungResultsBatch {
  // Stay within browser keepalive limits, including long channel/component identifiers.
  const events: SamsungTestEvent[] = [];
  for (const event of pendingResults(ledger).slice(0, 100)) {
    if (
      events.length &&
      new TextEncoder().encode(JSON.stringify([...events, event])).byteLength >
        44000
    )
      break;
    events.push(event);
  }
  return {
    version: 1,
    batchId: newId(),
    clientId: ledger.clientId,
    createdAt: new Date().toISOString(),
    device: {
      model: ledger.model,
      firmware: ledger.firmware,
      browser: browser.slice(0, 500),
    },
    events,
  };
}
