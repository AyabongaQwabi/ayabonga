import { useState } from "react";
import type { useSamsungTestResults } from "../hooks/useSamsungTestResults";
export function SamsungTestResultsPanel({
  results,
}: {
  results: ReturnType<typeof useSamsungTestResults>;
}) {
  const [automatic, setAutomatic] = useState(true);
  return (
    <section className="sl-sharing" aria-labelledby="sl-sharing-title">
      <div className="sl-sharing-heading">
        <div>
          <h2 id="sl-sharing-title">Share your test results</h2>
          <p>
            {results.ledger.events.length} records recovered or recorded ·{" "}
            {results.pending} waiting to upload
          </p>
        </div>
        <button
          type="button"
          disabled={results.status === "uploading" || !results.pending}
          onClick={() => void results.share(automatic)}
        >
          {results.status === "uploading" ? "Uploading…" : "Share test results"}
        </button>
      </div>
      <p>
        Uploads only launcher test results, app targets, browser details and the
        optional device details below. This recovers old marks still stored in
        this tab. Sharing also enables future uploads unless you turn that
        option off below.
      </p>
      {!results.ledger.events.length && (
        <p>
          No stored marks were found here. Use the original tested tab; another
          tab or browser may not contain its session results.
        </p>
      )}
      <details>
        <summary>Sharing options and download</summary>
        <label>
          <input
            type="checkbox"
            checked={automatic}
            onChange={(event) => setAutomatic(event.target.checked)}
          />{" "}
          After sharing, automatically upload future tests from this browser
        </label>
        <div className="sl-sharing-device">
          <label>
            Device model (optional)
            <input
              maxLength={80}
              value={results.ledger.model}
              onChange={(event) =>
                results.setDevice("model", event.target.value)
              }
              placeholder="SM-A155F"
            />
          </label>
          <label>
            Software/build (optional)
            <input
              maxLength={100}
              value={results.ledger.firmware}
              onChange={(event) =>
                results.setDevice("firmware", event.target.value)
              }
              placeholder="Build number from About phone"
            />
          </label>
        </div>
        <button type="button" onClick={results.download}>
          Download a JSON copy
        </button>
      </details>
      {results.ledger.sharing && (
        <p>
          Automatic sharing is on.{" "}
          <button type="button" onClick={results.pause}>
            Pause sharing
          </button>
        </p>
      )}
      <div role="status" aria-live="polite">
        {results.ledger.lastReceipt && (
          <p>
            Uploaded successfully. Report code:{" "}
            <code>{results.ledger.lastReceipt}</code>
          </p>
        )}
        {results.error && <p>{results.error}</p>}
        {results.storageError && (
          <p>
            Local storage is unavailable or full. Download a copy before closing
            this tab. Sharing also enables future uploads unless you turn that
            option off below.
          </p>
        )}
      </div>
    </section>
  );
}
