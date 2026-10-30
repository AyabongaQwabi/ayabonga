import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  validateResultsBatch,
  type SamsungResultsBatch,
} from "../src/lib/samsung-test-results-schema.js";
import { storeResults } from "./lib/_samsung-results-store.js";
const windows = new Map<string, { start: number; count: number }>();
export async function handleSamsungResults(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body: unknown;
  },
  save: (batch: SamsungResultsBatch) => Promise<string> = storeResults,
) {
  if (req.method !== "POST")
    return { status: 405, body: { error: "Method not allowed" } };
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (typeof origin === "string") {
    try {
      if (new URL(origin).host !== host)
        return { status: 403, body: { error: "Origin not allowed" } };
    } catch {
      return { status: 403, body: { error: "Origin not allowed" } };
    }
  }
  if (
    !String(req.headers["content-type"] ?? "")
      .toLowerCase()
      .startsWith("application/json")
  )
    return { status: 415, body: { error: "Send JSON results" } };
  let batch: SamsungResultsBatch;
  try {
    const raw =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (typeof raw !== "string" || Buffer.byteLength(raw, "utf8") > 200000)
      return { status: 413, body: { error: "Results batch too large" } };
    batch = validateResultsBatch(JSON.parse(raw));
  } catch {
    return { status: 400, body: { error: "Invalid test results" } };
  }
  // Best-effort per-instance rate limit; do not retain IPs or request headers in reports.
  const ip = String(req.headers["x-forwarded-for"] ?? "anonymous").split(
    ",",
  )[0];
  const now = Date.now();
  if (windows.size > 2000)
    for (const [key, value] of windows)
      if (now - value.start > 60000) windows.delete(key);
  const window = windows.get(ip);
  if (window && now - window.start < 60000) {
    if (window.count >= 60)
      return { status: 429, body: { error: "Please retry in a minute" } };
    window.count++;
  } else windows.set(ip, { start: now, count: 1 });
  try {
    const receiptId = await save(batch);
    return {
      status: 200,
      body: {
        ok: true,
        receiptId,
        acceptedEventIds: batch.events.map((event) => event.id),
      },
    };
  } catch {
    console.error("[api/samsung-intent-results] Save unavailable");
    return {
      status: 503,
      body: {
        error: "Upload unavailable. Your results remain saved on this device.",
      },
    };
  }
}
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Allow", "POST");
  const result = await handleSamsungResults(req);
  return res.status(result.status).json(result.body);
}
