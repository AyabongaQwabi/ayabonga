import type { SamsungTestEvent } from "./samsung-test-results-schema";
import type { LauncherSession } from "./samsung-launch-session";

export type ActivityStatus = "worked" | "failed" | "untested";
export type ActivitySort = "recommended" | "name" | "recent" | "status";
export function activityStatus(key: string, worked: string[], failed: string[]): ActivityStatus {
  return worked.includes(key) ? "worked" : failed.includes(key) ? "failed" : "untested";
}

/** A tap is an attempt, never proof of success. Legacy results precede dated outcomes. */
export function restoreActivityResults(session: LauncherSession, events: SamsungTestEvent[]): LauncherSession {
  const worked = new Set(session.worked);
  const failed = new Set(session.failed);
  for (const event of [...events].sort((a, b) =>
    Number(a.testedAt !== null) - Number(b.testedAt !== null) || a.recordedAt.localeCompare(b.recordedAt),
  )) {
    if (event.outcome === "opened") continue;
    worked.delete(event.launchKey);
    failed.delete(event.launchKey);
    if (["worked", "legacy-worked"].includes(event.outcome)) worked.add(event.launchKey);
    else if (event.outcome !== "cleared") failed.add(event.launchKey);
  }
  return { ...session, worked: [...worked].slice(-1500), failed: [...failed].slice(-1500) };
}

/** Quote CSV values and prevent spreadsheet formula execution in imported names. */
export function activityCsv(rows: string[][]): string {
  return "\uFEFF" + rows.map(row => row.map(value => {
    const safe = /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  }).join(",")).join("\r\n");
}
