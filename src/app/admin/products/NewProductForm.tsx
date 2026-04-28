"use client";

import { useActionState } from "react";

import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import { SHOP_CATEGORIES } from "@/lib/catalog";

import { ImageUrlsField } from "./ImageUrlsField";
import { createProduct, type ProductActionState } from "./actions";

export function NewProductForm() {
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    createProduct,
    null,
  );

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="slug">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          required
          placeholder="flamingo-tee"
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
        <p className="mt-1 text-xs text-zinc-500">Lowercase, hyphens only. Example: abstract-garden-shorts</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="product-description-editor">
          Description
        </label>
        <div className="mt-1">
          <ProductDescriptionEditor />
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Rich text — up to 8,000 characters of text. Optional; you can publish without a
          description.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="categorySlug">
          Collection
        </label>
        <select
          id="categorySlug"
          name="categorySlug"
          required
          defaultValue="other"
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        >
          {SHOP_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-zinc-500">Used for filters on the public catalog.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="priceDollars">
          Price (USD)
        </label>
        <input
          id="priceDollars"
          name="priceDollars"
          type="number"
          step="0.01"
          min="0.01"
          required
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      <ImageUrlsField />
      <div className="flex items-center gap-2">
        <input id="published" name="published" type="checkbox" className="h-5 w-5 rounded border-zinc-300" />
        <label htmlFor="published" className="min-h-11 py-1 text-sm text-zinc-700">
          Published (visible on storefront)
        </label>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-lg bg-zinc-900 px-5 py-3 text-base font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 touch-manipulation"
      >
        {pending ? "Saving…" : "Create product"}
      </button>
    </form>
  );
}
