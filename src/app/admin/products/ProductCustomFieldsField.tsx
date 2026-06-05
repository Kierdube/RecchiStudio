"use client";

import { useState } from "react";

import {
  DEFAULT_OPTIONS_LABEL,
  fieldOptionsFromText,
  fieldOptionsToText,
  MAX_PRODUCT_CUSTOM_FIELDS,
  type ProductCustomField,
  serializeCustomFieldsJson,
} from "@/lib/product-custom-fields";

type FieldDraft = {
  label: string;
  optionsText: string;
};

function fieldsToDrafts(fields: ProductCustomField[]): FieldDraft[] {
  return fields.map((field) => ({
    label: field.label === DEFAULT_OPTIONS_LABEL ? "" : field.label,
    optionsText: fieldOptionsToText(field.options),
  }));
}

function draftsToFields(drafts: FieldDraft[]): ProductCustomField[] {
  return drafts
    .map((draft) => ({
      label: draft.label.trim() || DEFAULT_OPTIONS_LABEL,
      options: fieldOptionsFromText(draft.optionsText),
    }))
    .filter((field) => field.options.length > 0);
}

export function ProductCustomFieldsField({
  defaultFields = [],
}: {
  defaultFields?: ProductCustomField[];
}) {
  const [fields, setFields] = useState<FieldDraft[]>(() =>
    defaultFields.length > 0 ? fieldsToDrafts(defaultFields) : [],
  );

  function updateField(index: number, patch: Partial<FieldDraft>) {
    setFields((current) =>
      current.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    );
  }

  function addField() {
    setFields((current) => {
      if (current.length >= MAX_PRODUCT_CUSTOM_FIELDS) return current;
      return [...current, { label: "", optionsText: "" }];
    });
  }

  function removeField(index: number) {
    setFields((current) => current.filter((_, i) => i !== index));
  }

  const serialized = serializeCustomFieldsJson(draftsToFields(fields));

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
      <div>
        <p className="text-sm font-medium text-zinc-700">Custom fields (optional)</p>
        <p className="mt-1 text-xs text-zinc-500">
          Add one or more dropdowns on the product page — sizes, colours, styles, or anything else.
          Leave all option lists empty and nothing appears on the storefront.
        </p>
      </div>
      <input type="hidden" name="customFieldsJson" value={serialized} />
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="space-y-3 rounded-lg border border-zinc-200 bg-white p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-700">Field {index + 1}</p>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Remove
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700" htmlFor={`custom-field-label-${index}`}>
                Field label
              </label>
              <input
                id={`custom-field-label-${index}`}
                value={field.label}
                onChange={(e) => updateField(index, { label: e.target.value })}
                placeholder="e.g. Size, Colour, Style"
                className="mt-1 min-h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
              />
              <p className="mt-1 text-xs text-zinc-500">
                Shown above this dropdown. Defaults to &ldquo;Option&rdquo; if left blank.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700" htmlFor={`custom-field-options-${index}`}>
                Options
              </label>
              <textarea
                id={`custom-field-options-${index}`}
                value={field.optionsText}
                onChange={(e) => updateField(index, { optionsText: e.target.value })}
                rows={3}
                placeholder={"Small\nMedium\nLarge"}
                className="mt-1 min-h-[5rem] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
              />
              <p className="mt-1 text-xs text-zinc-500">
                One option per line or comma-separated.
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addField}
        disabled={fields.length >= MAX_PRODUCT_CUSTOM_FIELDS}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add custom field
      </button>
    </div>
  );
}
