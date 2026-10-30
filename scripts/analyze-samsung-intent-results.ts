import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { list } from "@vercel/blob";
import {
  decryptResults,
  RESULTS_PREFIX,
  type ResultsEnvelope,
} from "../api/lib/samsung-results-store";
import {
  validateResultsBatch,
  type SamsungResultsBatch,
  type SamsungTestEvent,
} from "../src/lib/samsung-test-results-schema";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const out = option("--out");
if (!out)
  throw new Error(
    "Use --out /absolute/path/report.json. Optional: --receipt ID or --file downloaded-results.json",
  );
const env = { ...loadEnv("production", root, ""), ...process.env };
type RecordEntry = {
  receiptId: string;
  receivedAt: string;
  batch: SamsungResultsBatch;
};
const records: RecordEntry[] = [];
const file = option("--file");
if (file) {
  const raw = JSON.parse(await fs.readFile(file, "utf8"));
  if (!Array.isArray(raw.events))
    throw new Error("Downloaded results must contain events");
  for (let i = 0; i < raw.events.length; i += 100)
    records.push({
      receiptId: "local-download",
      receivedAt: raw.createdAt,
      batch: validateResultsBatch({
        ...raw,
        events: raw.events.slice(i, i + 100),
      }),
    });
} else {
  const token =
    env.BLOB_READ_WRITE_TOKEN?.trim() ||
    env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) throw new Error("Blob token is not configured");
  let cursor: string | undefined;
  do {
    const page = await list({
      token,
      prefix: RESULTS_PREFIX,
      limit: 1000,
      cursor,
    });
    cursor = page.hasMore ? page.cursor : undefined;
    for (const blob of page.blobs) {
      const response = await fetch(blob.url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!response.ok)
        throw new Error(`Could not read a results object (${response.status})`);
      const decoded = decryptResults(
        (await response.json()) as ResultsEnvelope,
        env.SAMSUNG_RESULTS_ENCRYPTION_KEY?.trim() || token,
      ) as RecordEntry;
      records.push({ ...decoded, batch: validateResultsBatch(decoded.batch) });
    }
  } while (cursor);
}
const receipt = option("--receipt");
const client = receipt
  ? records.find((record) => record.receiptId === receipt)?.batch.clientId
  : undefined;
if (receipt && !client)
  throw new Error("Report code not found in this connected store");
const selected = client
  ? records.filter((record) => record.batch.clientId === client)
  : records;
const events = new Map<
  string,
  SamsungTestEvent & { clientId: string; device: SamsungResultsBatch["device"] }
>();
for (const record of selected)
  for (const event of record.batch.events)
    events.set(`${record.batch.clientId}:${event.id}`, {
      ...event,
      clientId: record.batch.clientId,
      device: record.batch.device,
    });
const summaries = new Map<
  string,
  {
    shortcutId: string;
    name: string;
    action?: string;
    component?: string;
    worked: number;
    wrongScreen: number;
    didNotOpen: number;
    browserFallback: number;
    legacyFailed: number;
    attempted: number;
    likelyExplanation: string;
  }
>();
for (const event of events.values()) {
  const key = event.shortcutId;
  const row = summaries.get(key) ?? {
    shortcutId: key,
    name: event.name,
    action: event.action,
    component: event.component,
    worked: 0,
    wrongScreen: 0,
    didNotOpen: 0,
    browserFallback: 0,
    legacyFailed: 0,
    attempted: 0,
    likelyExplanation: event.component
      ? "Explicit activity component: browser routing/export rules need native-device verification."
      : /MANAGE_APP_PERMISSION|APP_PERMISSIONS_SETTINGS/.test(
            event.action ?? "",
          )
        ? "Internal permission API: privileged caller restrictions are a likely cause."
        : event.action === "android.intent.action.MAIN"
          ? "App launcher target: installed app and browser-accessible activity are required."
          : "Check the exact target package, required extras and firmware activity support; a failed launch alone does not identify the cause.",
  };
  if (event.outcome === "worked" || event.outcome === "legacy-worked")
    row.worked++;
  if (event.outcome === "wrong-screen") row.wrongScreen++;
  if (event.outcome === "did-not-open") row.didNotOpen++;
  if (event.outcome === "browser-fallback") row.browserFallback++;
  if (event.outcome === "legacy-failed") row.legacyFailed++;
  if (event.outcome === "opened") row.attempted++;
  summaries.set(key, row);
}
const latest = new Map<
  string,
  typeof events extends Map<string, infer V> ? V : never
>();
for (const event of [...events.values()].sort(
  (a, b) =>
    (a.testedAt === null ? 0 : 1) - (b.testedAt === null ? 0 : 1) ||
    a.recordedAt.localeCompare(b.recordedAt),
))
  if (event.outcome !== "opened")
    latest.set(`${event.clientId}:${event.launchKey}`, event);
const report = {
  createdAt: new Date().toISOString(),
  source: file ? "download" : "encrypted-site-storage",
  receipts: selected.map((record) => record.receiptId),
  clients: [...new Set(selected.map((record) => record.batch.clientId))],
  eventCount: events.size,
  summary: [...summaries.values()].sort(
    (a, b) =>
      b.wrongScreen +
      b.didNotOpen +
      b.browserFallback +
      b.legacyFailed -
      (a.wrongScreen + a.didNotOpen + a.browserFallback + a.legacyFailed),
  ),
  latestResults: [...latest.values()],
  events: [...events.values()],
};
await fs.mkdir(path.dirname(path.resolve(out)), { recursive: true });
await fs.writeFile(out, JSON.stringify(report, null, 2), { mode: 0o600 });
console.log(
  JSON.stringify({
    reports: selected.length,
    uniqueEvents: events.size,
    shortcuts: summaries.size,
    output: path.resolve(out),
  }),
);
