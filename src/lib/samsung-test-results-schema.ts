export const RESULT_OUTCOMES = [
  "opened",
  "worked",
  "did-not-open",
  "wrong-screen",
  "browser-fallback",
  "cleared",
  "legacy-worked",
  "legacy-failed",
] as const;
export type ResultOutcome = (typeof RESULT_OUTCOMES)[number];
export type SamsungTestEvent = {
  id: string;
  recordedAt: string;
  testedAt: string | null;
  outcome: ResultOutcome;
  source: "live" | "legacy-session" | "legacy-local";
  launchKey: string;
  shortcutId: string;
  name: string;
  action?: string;
  component?: string;
  intentUri?: string;
  targetPackage?: string;
  channelId?: string;
  mode?: string;
  group?: string;
};
export type SamsungResultsBatch = {
  version: 1;
  batchId: string;
  clientId: string;
  createdAt: string;
  device: { model: string; firmware: string; browser: string };
  events: SamsungTestEvent[];
};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const text = (value: unknown, max: number): string => {
  if (
    typeof value !== "string" ||
    value.length > max ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 && ![9, 10, 13].includes(code);
    })
  )
    throw new Error("Invalid results field");
  return value;
};
const date = (value: unknown): string => {
  const result = text(value, 40);
  if (!Number.isFinite(Date.parse(result)))
    throw new Error("Invalid results date");
  return result;
};
export function validateResultsBatch(input: unknown): SamsungResultsBatch {
  if (!input || typeof input !== "object")
    throw new Error("Results must be a JSON object");
  const value = input as Record<string, unknown>;
  if (
    value.version !== 1 ||
    typeof value.batchId !== "string" ||
    !uuid.test(value.batchId) ||
    typeof value.clientId !== "string" ||
    !uuid.test(value.clientId)
  )
    throw new Error("Invalid results version or identifier");
  if (
    !Array.isArray(value.events) ||
    value.events.length < 1 ||
    value.events.length > 100
  )
    throw new Error("Send between 1 and 100 results");
  const rawDevice =
    value.device && typeof value.device === "object"
      ? (value.device as Record<string, unknown>)
      : {};
  const ids = new Set<string>();
  const events = value.events.map((raw: unknown): SamsungTestEvent => {
    if (!raw || typeof raw !== "object") throw new Error("Invalid result");
    const e = raw as Record<string, unknown>;
    const id = text(e.id, 80);
    if (!uuid.test(id) || ids.has(id))
      throw new Error("Invalid or duplicate result ID");
    ids.add(id);
    if (
      !RESULT_OUTCOMES.includes(e.outcome as ResultOutcome) ||
      !["live", "legacy-session", "legacy-local"].includes(e.source as string)
    )
      throw new Error("Invalid result outcome");
    const normalized: SamsungTestEvent = {
      id,
      recordedAt: date(e.recordedAt),
      testedAt: e.testedAt === null ? null : date(e.testedAt),
      outcome: e.outcome as ResultOutcome,
      source: e.source as SamsungTestEvent["source"],
      launchKey: text(e.launchKey, 5000),
      shortcutId: text(e.shortcutId, 2200),
      name: text(e.name, 250),
    };
    for (const [key, max] of [
      ["action", 300],
      ["component", 2200],
      ["intentUri", 24000],
      ["targetPackage", 250],
      ["channelId", 2000],
      ["mode", 40],
      ["group", 100],
    ] as const)
      if (e[key] !== undefined) normalized[key] = text(e[key], max);
    return normalized;
  });
  // Rebuild from allowed fields. Never store arbitrary storage dumps, tokens or request headers.
  return {
    version: 1,
    batchId: value.batchId,
    clientId: value.clientId,
    createdAt: date(value.createdAt),
    device: {
      model: text(rawDevice.model ?? "", 80),
      firmware: text(rawDevice.firmware ?? "", 100),
      browser: text(rawDevice.browser ?? "", 500),
    },
    events,
  };
}
