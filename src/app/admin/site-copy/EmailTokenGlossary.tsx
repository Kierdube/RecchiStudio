"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import {
  buildEmailTokenGlossary,
  EMAIL_TEMPLATE_TIPS,
} from "@/lib/email-copy-admin";

export function EmailTokenGlossary() {
  const [open, setOpen] = useState(false);
  const entries = useMemo(() => buildEmailTokenGlossary(), []);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-zinc-50 sm:px-5"
      >
        <span>
          <span className="block text-base font-semibold text-zinc-900">Token glossary</span>
          <span className="mt-0.5 block text-sm text-zinc-600">
            What each {"{token}"} means across all email templates
          </span>
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-6 border-t border-zinc-100 px-4 py-4 sm:px-5 sm:py-5">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Dynamic tokens</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Leave these in your template exactly as shown — they are replaced with real data when each
              email sends. Empty optional values (e.g. no reference images) are omitted automatically.
            </p>
            <dl className="mt-4 divide-y divide-zinc-100 rounded-lg border border-zinc-200">
              {entries.map((entry) => (
                <div
                  key={entry.token}
                  className="grid gap-2 px-3 py-3 sm:grid-cols-[10rem_1fr_auto] sm:items-start sm:gap-4 sm:px-4"
                >
                  <dt className="font-mono text-sm font-semibold text-zinc-900">{entry.token}</dt>
                  <dd className="text-sm text-zinc-600">{entry.description}</dd>
                  <dd className="text-xs text-zinc-500 sm:text-right">
                    {entry.usedIn.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Template formatting</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Special lines and syntax supported in the editable templates.
            </p>
            <dl className="mt-4 space-y-3">
              {EMAIL_TEMPLATE_TIPS.map((tip) => (
                <div
                  key={tip.label}
                  className="grid gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4"
                >
                  <dt className="font-mono text-xs font-semibold text-zinc-900">{tip.label}</dt>
                  <dd className="text-sm text-zinc-600">{tip.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ) : null}
    </section>
  );
}
