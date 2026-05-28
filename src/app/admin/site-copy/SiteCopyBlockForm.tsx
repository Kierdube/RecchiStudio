"use client";

import { useActionState } from "react";

import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";
import { siteCopyEditorMode } from "@/lib/site-copy-editor";

import { saveSiteCopyBlock, type SiteCopyActionState } from "./actions";

const HTML_TEXT_LIMIT = 12000;
const INLINE_TEXT_LIMIT = 4000;

export function SiteCopyBlockForm({ def, value }: { def: SiteCopyDefinition; value: string }) {
  const [state, formAction, pending] = useActionState<SiteCopyActionState, FormData>(
    saveSiteCopyBlock,
    null,
  );

  const editorMode = siteCopyEditorMode(def.key, def.format);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <input type="hidden" name="key" value={def.key} />
      <p className="text-sm font-medium text-zinc-800">{def.label}</p>
      {editorMode === "plain" ? (
        <textarea
          name="value"
          rows={def.key.includes("rotate_words") ? 5 : 3}
          defaultValue={value}
          className="min-h-[5rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-sans text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      ) : null}
      {editorMode === "rich-inline" ? (
        <ProductDescriptionEditor
          defaultValue={value}
          placeholder="Write your text…"
          hiddenInputName="value"
          fieldId={`site-copy-${def.key.replace(/\./g, "-")}`}
          textLimit={INLINE_TEXT_LIMIT}
          variant="inline"
        />
      ) : null}
      {editorMode === "rich-block" ? (
        <ProductDescriptionEditor
          defaultValue={value}
          placeholder="Write your content…"
          hiddenInputName="value"
          fieldId={`site-copy-${def.key.replace(/\./g, "-")}`}
          textLimit={HTML_TEXT_LIMIT}
          variant="block"
        />
      ) : null}
      {editorMode === "mdx" ? (
        <textarea
          name="value"
          rows={18}
          defaultValue={value}
          spellCheck
          placeholder="Write the full page text…"
          className="min-h-[14rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-sans text-sm leading-relaxed text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      ) : null}
      {def.format === "choice" && def.choices ? (
        <select
          name="value"
          defaultValue={value || "inherit"}
          className="min-h-11 w-full max-w-md rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        >
          {def.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
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
