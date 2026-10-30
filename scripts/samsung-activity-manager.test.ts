import assert from "node:assert/strict";
import test from "node:test";
import { activityCsv, activityStatus, restoreActivityResults } from "../src/lib/samsung-activity-manager";
import { readLaunchSession } from "../src/lib/samsung-launch-session";
import type { SamsungTestEvent } from "../src/lib/samsung-test-results-schema";
const event = (outcome: SamsungTestEvent["outcome"], time: string, key = "wifi"): SamsungTestEvent => ({
  id: crypto.randomUUID(), name: key, shortcutId: key, launchKey: key, outcome,
  recordedAt: time, testedAt: time, source: "live",
});
test("durable outcomes restore independently per target and attempts never imply success", () => {
  const initial = readLaunchSession({ getItem: () => null });
  const results = restoreActivityResults(initial, [
    event("worked", "2026-10-30T00:00:00Z"),
    event("opened", "2026-10-31T00:00:00Z"),
    event("browser-fallback", "2026-10-31T00:00:00Z", "app:one"),
    event("worked", "2026-10-31T00:00:00Z", "app:two"),
  ]);
  assert.equal(activityStatus("wifi", results.worked, results.failed), "worked");
  assert.equal(activityStatus("app:one", results.worked, results.failed), "failed");
  assert.equal(activityStatus("app:two", results.worked, results.failed), "worked");
  assert.equal(activityStatus("other", results.worked, results.failed), "untested");
});
test("a cleared result stays cleared after reload and legacy marks cannot overwrite a newer test", () => {
  const legacy = { ...event("legacy-failed", "2026-10-31T00:00:00Z"), testedAt: null };
  const results = restoreActivityResults(readLaunchSession({ getItem: () => null }), [
    event("worked", "2026-10-30T00:00:00Z"), legacy,
    event("did-not-open", "2026-10-30T00:00:00Z", "clear"),
    event("cleared", "2026-10-31T00:00:00Z", "clear"),
  ]);
  assert.deepEqual(results.worked, ["wifi"]);
  assert.deepEqual(results.failed, []);
});
test("CSV preserves punctuation and neutralizes spreadsheet formulas", () => {
  assert.equal(activityCsv([['A, "B"', '=HYPERLINK("example")', 'line\nbreak']]), '\uFEFF"A, ""B""","\'=HYPERLINK(""example"")","line\nbreak"');
});
