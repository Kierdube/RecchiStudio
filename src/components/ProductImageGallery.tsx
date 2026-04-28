"use client";

import { useState } from "react";

import { productImageUrls } from "@/lib/product-images";

type Props = {
  name: string;
  /** Raw JSON string from the database */
  imageUrlsJson: string | null | undefined;
};

export function ProductImageGallery({ name, imageUrlsJson }: Props) {
  const urls = productImageUrls(imageUrlsJson);
  const [active, setActive] = useState(0);

  if (urls.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center text-[#19371E]/40">
        No image
      </div>
    );
  }

  const safeIndex = Math.min(active, urls.length - 1);
  const current = urls[safeIndex]!;

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={current}
        alt={urls.length > 1 ? `${name} — photo ${safeIndex + 1} of ${urls.length}` : name}
        className="aspect-square w-full object-cover"
      />
      {urls.length > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto border-t border-[#19371E]/10 bg-[#F4F9EF]/60 px-3 py-3 [-webkit-overflow-scrolling:touch]"
          role="tablist"
          aria-label="Product photos"
        >
          {urls.map((url, idx) => (
            <button
              key={`${url}-${idx}`}
              type="button"
              role="tab"
              aria-selected={idx === safeIndex}
              onClick={() => setActive(idx)}
              className={`relative shrink-0 overflow-hidden rounded-xl ring-2 transition touch-manipulation ${
                idx === safeIndex ? "ring-[#2d5a36]" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-16 w-16 object-cover sm:h-20 sm:w-20" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
