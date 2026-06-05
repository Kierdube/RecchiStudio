"use client";

import { useState } from "react";

import { productPreviewUrl } from "@/lib/product-preview";

import { regeneratePreviewToken } from "./actions";

export function ProductPreviewLink({
  productId,
  slug,
  previewToken,
  published,
}: {
  productId: string;
  slug: string;
  previewToken: string | null;
  published: boolean;
}) {
  const [copied, setCopied] = useState(false);

  if (published || !previewToken) {
    return null;
  }

  const url = productPreviewUrl(slug, previewToken);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-4">
      <p className="text-sm font-semibold text-amber-950">Draft preview link</p>
      <p className="mt-1 text-xs text-amber-900/80">
        Share this private link to preview the product before publishing. It does not appear in the
        catalog or sitemap.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="max-w-full truncate rounded-md bg-white/80 px-2 py-1 text-xs text-zinc-700 ring-1 ring-amber-200">
          {url}
        </code>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="min-h-9 rounded-md border border-amber-300 bg-white px-3 text-xs font-medium text-amber-950 hover:bg-amber-100"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="min-h-9 rounded-md border border-amber-300 bg-white px-3 text-xs font-medium text-amber-950 hover:bg-amber-100"
        >
          Open preview ↗
        </a>
      </div>
      <form action={regeneratePreviewToken} className="mt-3">
        <input type="hidden" name="id" value={productId} />
        <button
          type="submit"
          className="text-xs font-medium text-amber-900/80 underline-offset-2 hover:text-amber-950 hover:underline"
        >
          Regenerate link (invalidates old URLs)
        </button>
      </form>
    </div>
  );
}
