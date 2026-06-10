"use client";

import { useActionState } from "react";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";
import { siteCopyEditorMode } from "@/lib/site-copy-editor";

import { saveSiteCopyBlock, type SiteCopyActionState } from "./actions";

const HTML_TEXT_LIMIT = 12000;
const INLINE_TEXT_LIMIT = 4000;

export function SiteCopyBlockForm({
  def,
  value,
  textareaRows,
}: {
  def: SiteCopyDefinition;
  value: string;
  textareaRows?: number;
}) {
  const [state, formAction, pending] = useActionState<SiteCopyActionState, FormData>(
    saveSiteCopyBlock,
    null,
  );

  const editorMode = siteCopyEditorMode(def.key, def.format);
  const isChoice = def.format === "choice" && Boolean(def.choices);

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
      <input type="hidden" name="key" value={def.key} />
      <p className="text-sm font-medium text-zinc-800">{def.label}</p>
      {editorMode === "image" ? (
        <ImageUploadField
          defaultValue={value}
          hiddenInputName="value"
          fieldId={`site-copy-${def.key.replace(/\./g, "-")}`}
        />
      ) : null}
      {editorMode === "plain" ? (
        <textarea
          name="value"
          rows={textareaRows ?? (def.key.includes("rotate_words") ? 5 : def.key.includes(".template") ? 18 : 3)}
          defaultValue={value}
          spellCheck={def.key.includes(".template") ? false : undefined}
          className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none ring-zinc-400 focus:ring-2 ${
            def.key.includes(".template")
              ? "min-h-[20rem] font-mono text-sm leading-relaxed text-zinc-900"
              : "min-h-[5rem] font-sans text-base text-zinc-900"
          }`}
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
      <div
        className={
          isChoice
            ? "flex flex-wrap items-center gap-4 pt-0.5"
            : "flex flex-wrap items-center gap-4 border-t border-zinc-200/80 pt-3"
        }
      >
        {isChoice && def.choices ? (
          <select
            name="value"
            defaultValue={value || "inherit"}
            className="min-h-11 min-w-[12rem] flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2 sm:max-w-md"
          >
            {def.choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="min-h-10 shrink-0 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 touch-manipulation"
        >
          {pending ? "Saving…" : "Save"}
        </button>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state?.ok ? <p className="text-sm text-emerald-700">Saved.</p> : null}
    </form>
  );
}
