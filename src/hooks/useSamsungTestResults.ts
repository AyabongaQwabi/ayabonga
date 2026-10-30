import { useCallback, useEffect, useRef, useState } from "react";
import type { ActivityShortcut } from "../lib/samsung-intents";
import {
  createResultsBatch,
  pendingResults,
  persistResults,
  readResults,
  recoverStoredResults,
  recordTestResult,
  type ResultsLedger,
} from "../lib/samsung-test-results";
import type { ResultOutcome } from "../lib/samsung-test-results-schema";
function browserStorage(
  kind: "localStorage" | "sessionStorage",
): Storage | null {
  try {
    return window[kind];
  } catch {
    return null;
  }
}
export function useSamsungTestResults(
  catalog: ActivityShortcut[],
  context: { mode: string; group: string },
) {
  const [ledger, setLedger] = useState(() =>
    recoverStoredResults(
      readResults(browserStorage("localStorage")),
      browserStorage("localStorage"),
      browserStorage("sessionStorage"),
      catalog,
    ),
  );
  const ledgerRef = useRef(ledger);
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const contextRef = useRef(context);
  contextRef.current = context;
  const busy = useRef(false);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "saved" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const commit = useCallback((next: ResultsLedger) => {
    ledgerRef.current = next;
    setLedger(next);
    setStorageError(!persistResults(browserStorage("localStorage"), next));
  }, []);
  useEffect(() => {
    setStorageError(
      !persistResults(browserStorage("localStorage"), ledgerRef.current),
    );
  }, []);
  const record = useCallback(
    (key: string, outcome: ResultOutcome) => {
      if (ledgerRef.current.events.length >= 20000) {
        setError(
          "The local log is full. Share or download your results before continuing.",
        );
        return;
      }
      commit(
        recordTestResult(
          ledgerRef.current,
          key,
          outcome,
          catalogRef.current,
          contextRef.current,
        ),
      );
    },
    [commit],
  );
  const flush = useCallback(
    async (force = false) => {
      if (
        busy.current ||
        (!force && !ledgerRef.current.sharing) ||
        !pendingResults(ledgerRef.current).length
      )
        return;
      busy.current = true;
      setStatus("uploading");
      setError("");
      try {
        while (pendingResults(ledgerRef.current).length) {
          const batch = createResultsBatch(
            ledgerRef.current,
            navigator.userAgent,
          );
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 20000);
          let response: Response;
          try {
            response = await fetch("/api/samsung-intent-results", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(batch),
              keepalive: true,
              signal: controller.signal,
            });
          } finally {
            clearTimeout(timeout);
          }
          const result = await response.json();
          if (
            !response.ok ||
            result.ok !== true ||
            typeof result.receiptId !== "string" ||
            !Array.isArray(result.acceptedEventIds)
          )
            throw new Error(
              "Upload unavailable. Your results are still on this device.",
            );
          const expected = new Set(batch.events.map((event) => event.id));
          const accepted = result.acceptedEventIds.filter(
            (id: unknown): id is string =>
              typeof id === "string" && expected.has(id),
          );
          if (new Set(accepted).size !== batch.events.length)
            throw new Error(
              "The server did not confirm the whole batch. Results are kept for retry.",
            );
          commit({
            ...ledgerRef.current,
            uploaded: [
              ...new Set([...ledgerRef.current.uploaded, ...accepted]),
            ],
            lastReceipt: result.receiptId,
          });
        }
        setStatus("saved");
      } catch {
        setStatus("error");
        setError(
          "Could not upload yet. Results remain saved on this device; retry or download a copy.",
        );
      } finally {
        busy.current = false;
      }
    },
    [commit],
  );
  const share = useCallback(
    async (automatic: boolean) => {
      commit({
        ...recoverStoredResults(
          ledgerRef.current,
          browserStorage("localStorage"),
          browserStorage("sessionStorage"),
          catalogRef.current,
        ),
        sharing: automatic,
      });
      await flush(true);
    },
    [commit, flush],
  );
  const setDevice = useCallback(
    (field: "model" | "firmware", value: string) =>
      commit({
        ...ledgerRef.current,
        [field]: value.slice(0, field === "model" ? 80 : 100),
      }),
    [commit],
  );
  const pause = useCallback(
    () => commit({ ...ledgerRef.current, sharing: false }),
    [commit],
  );
  const pending = pendingResults(ledger).length;
  useEffect(() => {
    if (!ledger.sharing || !pending) return;
    const timer = setTimeout(() => void flush(), 1200);
    return () => clearTimeout(timer);
  }, [ledger.sharing, pending, flush]);
  useEffect(() => {
    const retry = () => void flush();
    window.addEventListener("online", retry);
    const interval = setInterval(retry, 30000);
    return () => {
      window.removeEventListener("online", retry);
      clearInterval(interval);
    };
  }, [flush]);
  const download = useCallback(() => {
    const recovered = recoverStoredResults(
      ledgerRef.current,
      browserStorage("localStorage"),
      browserStorage("sessionStorage"),
      catalogRef.current,
    );
    commit(recovered);
    const value = {
      version: 1,
      batchId: crypto.randomUUID(),
      clientId: recovered.clientId,
      createdAt: new Date().toISOString(),
      device: {
        model: recovered.model,
        firmware: recovered.firmware,
        browser: navigator.userAgent,
      },
      events: recovered.events,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `samsung-intent-tests-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [commit]);
  return {
    ledger,
    pending,
    status,
    error,
    storageError,
    record,
    share,
    setDevice,
    pause,
    download,
  };
}
