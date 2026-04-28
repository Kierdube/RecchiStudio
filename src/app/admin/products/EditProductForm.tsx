"use client";

import { useActionState } from "react";

import type { Product } from "@prisma/client";

import { SHOP_CATEGORIES } from "@/lib/catalog";

import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import { productImageUrls } from "@/lib/product-images";

import { ImageUrlsField } from "./ImageUrlsField";
import { updateProduct, type ProductActionState } from "./actions";

export function EditProductForm({ product }: { product: Product }) {
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(
    updateProduct,
    null,
  );

  const dollars = (product.priceCents / 100).toFixed(2);

  return (
    <form action={formAction} className="mx-auto max-w-2xl space-y-6">
      <input type="hidden" name="id" value={product.id} />
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={product.name}
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
          defaultValue={product.slug}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="product-description-editor">
          Description
        </label>
        <div className="mt-1">
          <ProductDescriptionEditor defaultValue={product.description} />
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          Rich text editor — up to 8,000 characters of actual text (headings, lists, links, and basic
          styling). Shown on the public product page.
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
          defaultValue={product.categorySlug}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        >
          {SHOP_CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
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
          defaultValue={dollars}
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      <ImageUrlsField defaultUrls={productImageUrls(product.imageUrls)} />
      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          defaultChecked={product.published}
          className="h-5 w-5 rounded border-zinc-300"
        />
        <label htmlFor="published" className="min-h-11 py-1 text-sm text-zinc-700">
          Published
        </label>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-lg bg-zinc-900 px-5 py-3 text-base font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 touch-manipulation"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
