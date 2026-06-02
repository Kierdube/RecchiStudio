"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/contexts/CartContext";

export function ProductPurchaseActions({
  productId,
  slug,
  name,
  priceCents,
  imageUrl,
  sizes = [],
}: {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  sizes?: string[];
}) {
  const { addItem, justAdded, clearJustAdded } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onAddToCart() {
    setError(null);
    clearJustAdded();
    const size = sizes.length > 0 ? selectedSize : null;
    if (sizes.length > 0 && !size) {
      setError("Please select a size");
      return;
    }
    addItem({
      productId,
      slug,
      name,
      priceCents,
      imageUrl,
      size,
      quantity: 1,
    });
  }

  async function onBuyNow() {
    setCheckoutLoading(true);
    setError(null);
    try {
      const size = sizes.length > 0 ? selectedSize : undefined;
      if (sizes.length > 0 && !size) {
        setError("Please select a size");
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, size, quantity: 1 }],
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No redirect URL returned");
    } catch {
      setError("Network error");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div>
      {sizes.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-[#19371E]/10 bg-white/70 px-5 py-4 shadow-sm">
          <label
            htmlFor="size-select"
            className="text-xs font-semibold tracking-[0.12em] text-[#2d5a36]/80"
          >
            Size
          </label>
          <select
            id="size-select"
            name="size"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="mt-3 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-white px-3 py-2 text-sm font-semibold text-[#19371E] shadow-sm outline-none transition focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onAddToCart}
          className="inline-flex min-h-12 min-w-[min(100%,220px)] touch-manipulation items-center justify-center rounded-full bg-[#19371E] px-8 py-4 text-base font-semibold text-white shadow-md shadow-[#19371E]/10 transition hover:bg-[#2d5a36] sm:text-sm"
        >
          Add to cart
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={checkoutLoading}
          className="inline-flex min-h-12 min-w-[min(100%,220px)] touch-manipulation items-center justify-center rounded-full border-2 border-[#19371E]/15 bg-white px-8 py-4 text-base font-semibold text-[#19371E] transition hover:border-[#19371E]/25 hover:bg-[#F4F9EF] disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
        >
          {checkoutLoading ? "Redirecting…" : "Buy now"}
        </button>
      </div>

      {justAdded ? (
        <p className="mt-3 text-sm font-medium text-[#2d5a36]">
          Added to cart.{" "}
          <Link href="/cart" className="underline underline-offset-2">
            View cart
          </Link>
        </p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
