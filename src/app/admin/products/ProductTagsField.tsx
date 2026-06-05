"use client";

import { useState } from "react";

import {
  MAX_PRODUCT_TAGS,
  parseTagsJson,
  PRODUCT_TAG_COLORS,
  serializeTagsJson,
  type ProductTag,
  type ProductTagColor,
} from "@/lib/product-tags";

export function ProductTagsField({
  defaultTagsJson,
}: {
  defaultTagsJson?: string | null;
}) {
  const [tags, setTags] = useState<ProductTag[]>(() => parseTagsJson(defaultTagsJson));

  function updateTag(index: number, patch: Partial<ProductTag>) {
    setTags((current) =>
      current.map((tag, i) => (i === index ? { ...tag, ...patch } : tag)),
    );
  }

  function addTag() {
    setTags((current) => {
      if (current.length >= MAX_PRODUCT_TAGS) return current;
      return [...current, { label: "", color: "mint" }];
    });
  }

  function removeTag(index: number) {
    setTags((current) => current.filter((_, i) => i !== index));
  }

  const serialized = serializeTagsJson(
    tags
      .map((tag) => ({
        label: tag.label.trim(),
        color: tag.color,
      }))
      .filter((tag) => tag.label.length > 0),
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Display tags</label>
        <p className="mt-1 text-xs text-zinc-500">
          Shown below the product title on the storefront. These are labels only — not links. Use
          them for collection, article type, or any other notes. The Collection dropdown above still
          controls catalog filters.
        </p>
      </div>
      <input type="hidden" name="tagsJson" value={serialized} />
      <div className="space-y-3">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-lg border border-zinc-200 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_10rem_auto]"
          >
            <div>
              <label className="sr-only" htmlFor={`product-tag-label-${index}`}>
                Tag label
              </label>
              <input
                id={`product-tag-label-${index}`}
                value={tag.label}
                onChange={(e) => updateTag(index, { label: e.target.value })}
                placeholder="e.g. Sweater"
                className="min-h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
              />
            </div>
            <div>
              <label className="sr-only" htmlFor={`product-tag-color-${index}`}>
                Tag colour
              </label>
              <select
                id={`product-tag-color-${index}`}
                value={tag.color}
                onChange={(e) => updateTag(index, { color: e.target.value as ProductTagColor })}
                className="min-h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
              >
                {PRODUCT_TAG_COLORS.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="min-h-10 rounded-lg border border-zinc-300 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addTag}
        disabled={tags.length >= MAX_PRODUCT_TAGS}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add tag
      </button>
    </div>
  );
}
