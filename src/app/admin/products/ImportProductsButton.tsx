"use client";

import { useState, useTransition } from "react";

type ImportResult =
  | {
      ok: true;
      created: number;
      updated: number;
      skipped: number;
      errors: Array<{ row: number; slug?: string; error: string }>;
    }
  | { error: string };

export function ImportProductsButton() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ImportResult | null>(null);

  function run() {
    setResult(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/import-products", { method: "POST" });
        const json = (await res.json()) as ImportResult;
        if (!res.ok) {
          setResult({ error: "error" in json ? json.error : "Import failed" });
          return;
        }
        setResult(json);
      } catch {
        setResult({ error: "Import failed (network error)" });
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={run}
        disabled={pending}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
      >
        {pending ? "Importing…" : "Import from CSV"}
      </button>

      {result ? (
        <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-700">
          {"error" in result ? (
            <p className="text-red-700">{result.error}</p>
          ) : (
            <div className="space-y-2">
              <p>
                Imported: <span className="font-semibold">{result.created}</span> created,{" "}
                <span className="font-semibold">{result.updated}</span> updated,{" "}
                <span className="font-semibold">{result.skipped}</span> skipped.
              </p>
              {result.errors.length ? (
                <details>
                  <summary className="cursor-pointer select-none font-medium">
                    Row errors ({result.errors.length})
                  </summary>
                  <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded bg-white p-2 text-[11px] leading-relaxed">
                    {JSON.stringify(result.errors, null, 2)}
                  </pre>
                </details>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
