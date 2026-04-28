"use client";

import { useActionState } from "react";

import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";

import { saveSiteCopyBlock, type SiteCopyActionState } from "./actions";

const HTML_TEXT_LIMIT = 12000;

export function SiteCopyBlockForm({ def, value }: { def: SiteCopyDefinition; value: string }) {
  const [state, formAction, pending] = useActionState<SiteCopyActionState, FormData>(
    saveSiteCopyBlock,
    null,
  );

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <input type="hidden" name="key" value={def.key} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-zinc-800">{def.label}</p>
        <code className="rounded bg-zinc-200/80 px-1.5 py-0.5 text-[10px] text-zinc-600">{def.key}</code>
      </div>
      {def.format === "plain" ? (
        <textarea
          name="value"
          rows={def.key.includes("rotate_words") ? 5 : 3}
          defaultValue={value}
          className="min-h-[5rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-sans text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      ) : null}
      {def.format === "html" ? (
        <ProductDescriptionEditor
          defaultValue={value}
          placeholder="Write HTML content…"
          hiddenInputName="value"
          fieldId={`site-copy-${def.key.replace(/\./g, "-")}`}
          textLimit={HTML_TEXT_LIMIT}
        />
      ) : null}
      {def.format === "mdx" ? (
        <textarea
          name="value"
          rows={18}
          defaultValue={value}
          spellCheck={false}
          className="min-h-[14rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      ) : null}
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.ok ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-10 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 touch-manipulation"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
