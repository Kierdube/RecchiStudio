"use client";

import { useActionState } from "react";

import {
  formatCatalogCentsForAdmin,
  catalogCentsToAdminDollars,
} from "@/lib/admin-pricing";

import {
  saveQuoteDraft,
  sendQuoteToCustomer,
  closeQuoteRequest,
  type QuoteActionState,
} from "./actions";

const inputClass =
  "mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2";

export function QuoteAdminForm({
  messageId,
  quoteNotes,
  quoteAmountCents,
  status,
}: {
  messageId: string;
  quoteNotes: string | null;
  quoteAmountCents: number | null;
  status: string;
}) {
  const defaultDollars =
    quoteAmountCents != null ? catalogCentsToAdminDollars(quoteAmountCents) : "";

  const [draftState, saveDraftAction, draftPending] = useActionState<QuoteActionState, FormData>(
    saveQuoteDraft,
    null,
  );
  const [sendState, sendAction, sendPending] = useActionState<QuoteActionState, FormData>(
    sendQuoteToCustomer,
    null,
  );

  const feedback =
    draftState && "ok" in draftState && draftState.ok
      ? draftState
      : sendState && "ok" in sendState && sendState.ok
        ? sendState
        : null;
  const error =
    draftState && "error" in draftState
      ? draftState.error
      : sendState && "error" in sendState
        ? sendState.error
        : null;

  return (
    <section className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">Quote</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Save a draft quote, then email the customer when the price and notes are ready.
      </p>
      {quoteAmountCents != null ? (
        <p className="mt-2 text-sm text-zinc-700">
          Current quote: <strong>{formatCatalogCentsForAdmin(quoteAmountCents)}</strong>
          {status === "quote_sent" ? " (sent)" : status === "quote_draft" ? " (draft)" : null}
        </p>
      ) : null}

      <form id="quote-form" action={saveDraftAction} className="mt-4 space-y-4">
        <input type="hidden" name="id" value={messageId} />
        <div>
          <label className="block text-sm font-medium text-zinc-700" htmlFor="quoteAmountDollars">
            Quote total (CAD)
          </label>
          <input
            id="quoteAmountDollars"
            name="quoteAmountDollars"
            type="number"
            step="0.01"
            min="0.01"
            required
            defaultValue={defaultDollars}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700" htmlFor="quoteNotes">
            Quote details (included in customer email)
          </label>
          <textarea
            id="quoteNotes"
            name="quoteNotes"
            rows={5}
            defaultValue={quoteNotes ?? ""}
            placeholder="Timeline, garment specs, payment instructions…"
            className="mt-1 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
          />
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={draftPending || sendPending}
            className="min-h-11 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-60"
          >
            {draftPending ? "Saving…" : "Save draft"}
          </button>
          <button
            type="submit"
            formAction={sendAction}
            disabled={draftPending || sendPending}
            className="min-h-11 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {sendPending ? "Sending…" : "Email quote to customer"}
          </button>
        </div>
      </form>

      {feedback?.ok ? (
        <p className="mt-4 text-sm text-emerald-700" role="status">
          {feedback.message}
        </p>
      ) : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {status !== "closed" ? (
        <form action={closeQuoteRequest} className="mt-6 border-t border-zinc-100 pt-4">
          <input type="hidden" name="id" value={messageId} />
          <button
            type="submit"
            className="text-sm font-medium text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline"
          >
            Mark as closed
          </button>
        </form>
      ) : null}
    </section>
  );
}
