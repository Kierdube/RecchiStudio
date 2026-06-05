"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/contexts/CartContext";
import {
  formatOptionsSummary,
  initialOptionSelections,
  type ProductCustomField,
  type ProductOptionSelections,
  validateProductOptionSelections,
} from "@/lib/product-custom-fields";

export function ProductPurchaseActions({
  productId,
  slug,
  name,
  priceCents,
  imageUrl,
  customFields = [],
}: {
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  customFields?: ProductCustomField[];
}) {
  const { addItem, justAdded, clearJustAdded } = useCart();
  const [selections, setSelections] = useState<ProductOptionSelections>(() =>
    initialOptionSelections(customFields),
  );
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectionKey = useMemo(
    () => customFields.map((field) => field.label).join("\0"),
    [customFields],
  );

  function updateSelection(label: string, value: string) {
    setSelections((current) => ({ ...current, [label]: value }));
  }

  function validatedSelections(): ProductOptionSelections | null {
    const validationError = validateProductOptionSelections(customFields, selections);
    if (validationError) {
      setError(validationError);
      return null;
    }
    if (customFields.length === 0) return null;
    const out: ProductOptionSelections = {};
    for (const field of customFields) {
      out[field.label] = selections[field.label]!.trim();
    }
    return out;
  }

  function onAddToCart() {
    setError(null);
    clearJustAdded();
    const options = validatedSelections();
    if (customFields.length > 0 && !options) return;

    addItem({
      productId,
      slug,
      name,
      priceCents,
      imageUrl,
      options,
      size: options ? formatOptionsSummary(options) : null,
      quantity: 1,
    });
  }

  async function onBuyNow() {
    setCheckoutLoading(true);
    setError(null);
    try {
      const options = validatedSelections();
      if (customFields.length > 0 && !options) return;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productId, options: options ?? undefined, quantity: 1 }],
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
    <div key={selectionKey}>
      {customFields.length > 0 ? (
        <div className="mb-6 space-y-5">
          {customFields.map((field) => (
            <div key={field.label}>
              <label
                htmlFor={`option-${field.label}`}
                className="text-xs font-semibold tracking-[0.12em] text-[#2d5a36]/80"
              >
                {field.label}
              </label>
              <select
                id={`option-${field.label}`}
                name={`option-${field.label}`}
                value={selections[field.label] ?? ""}
                onChange={(e) => updateSelection(field.label, e.target.value)}
                className="mt-3 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-white px-3 py-2 text-sm font-semibold text-[#19371E] shadow-sm outline-none transition focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
