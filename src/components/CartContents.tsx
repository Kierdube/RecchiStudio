"use client";

import Link from "next/link";
import { useState } from "react";

import { CheckoutCurrencyNote } from "@/components/CheckoutCurrencyNote";
import { DisplayPrice } from "@/components/DisplayPrice";
import { useCart } from "@/contexts/CartContext";
import { MAX_CART_LINE_QUANTITY } from "@/lib/cart";

export function CartContents() {
  const { items, itemCount, subtotalCents, removeItem, setQuantity, clearCart } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            size: i.size ?? undefined,
            quantity: i.quantity,
          })),
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

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#19371E]/20 bg-white/60 px-6 py-14 text-center">
        <p className="text-lg font-medium text-[#19371E]">Your cart is empty</p>
        <p className="mt-2 text-sm text-[#19371E]/65">Browse the catalog and add something you love.</p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-[#C5E6A6] px-6 py-3 text-sm font-semibold text-[#19371E] shadow-sm transition hover:bg-[#b3d992]"
        >
          Shop catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <ul className="divide-y divide-[#19371E]/10 rounded-2xl border border-[#19371E]/10 bg-white shadow-sm">
        {items.map((item) => (
          <li key={item.key} className="flex gap-4 p-4 sm:gap-5 sm:p-5">
            <Link
              href={`/products/${item.slug}`}
              className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] sm:h-28 sm:w-24"
            >
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full items-center justify-center text-xs text-[#19371E]/40">No image</span>
              )}
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-semibold text-[#19371E] hover:text-[#2d5a36]"
              >
                {item.name}
              </Link>
              {item.size ? (
                <p className="mt-1 text-xs font-medium tracking-wide text-[#2d5a36]/80">
                  Size {item.size}
                </p>
              ) : null}
              <p className="mt-2 text-sm font-medium tabular-nums text-[#2d5a36]">
                <DisplayPrice priceCents={item.priceCents} />
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="sr-only" htmlFor={`qty-${item.key}`}>
                  Quantity for {item.name}
                </label>
                <select
                  id={`qty-${item.key}`}
                  value={item.quantity}
                  onChange={(e) => setQuantity(item.key, Number(e.target.value))}
                  className="min-h-10 rounded-lg border border-[#19371E]/15 bg-white px-2 text-sm font-semibold text-[#19371E]"
                >
                  {Array.from({ length: MAX_CART_LINE_QUANTITY }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      Qty {n}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.key)}
                  className="text-sm font-medium text-red-700 underline-offset-2 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular-nums text-[#19371E]">
              <DisplayPrice priceCents={item.priceCents * item.quantity} />
            </p>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-[#19371E]/10 bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[#19371E]/55">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4 text-[#19371E]/75">
            <dt>Items</dt>
            <dd className="tabular-nums">{itemCount}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-[#19371E]/10 pt-3 text-base font-semibold text-[#19371E]">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">
              <DisplayPrice priceCents={subtotalCents} />
            </dd>
          </div>
        </dl>
        <CheckoutCurrencyNote className="mt-4" />
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkoutLoading}
          className="mt-6 inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-[#C5E6A6] px-6 py-3 text-base font-semibold text-[#19371E] shadow-md transition hover:bg-[#b3d992] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkoutLoading ? "Redirecting…" : "Checkout"}
        </button>
        <button
          type="button"
          onClick={clearCart}
          className="mt-3 w-full text-center text-sm font-medium text-[#19371E]/55 underline-offset-2 hover:text-[#19371E] hover:underline"
        >
          Clear cart
        </button>
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
        <p className="mt-4 text-xs leading-relaxed text-[#19371E]/50">
          Secure checkout with Stripe. Shipping and tax are calculated on the next step.
        </p>
      </aside>
    </div>
  );
}
