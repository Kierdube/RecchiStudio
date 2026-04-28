"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";
import { DISPLAY_CURRENCIES, type DisplayCurrencyCode } from "@/lib/currency";

export function CurrencySwitcher({
  className,
  layout = "inline",
}: {
  className?: string;
  /** `stacked`: full-width controls (e.g. mobile menu). */
  layout?: "inline" | "stacked";
}) {
  const ctx = useOptionalCurrency();
  if (!ctx) return null;
  const { currency, setCurrency } = ctx;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${layout === "stacked" ? "flex-col items-stretch gap-3" : ""} ${className ?? ""}`}
    >
      <label className="sr-only" htmlFor="currency-select">
        Display currency
      </label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as DisplayCurrencyCode)}
        className={`cursor-pointer rounded-full border border-[#19371E]/15 bg-white px-3 py-2 text-sm font-semibold uppercase tracking-wide text-[#19371E] shadow-sm outline-none transition hover:border-[#19371E]/28 focus:border-[#19371E]/25 focus:ring-2 focus:ring-[#C5E6A6]/80 sm:py-1.5 sm:text-xs ${layout === "stacked" ? "min-h-11 w-full" : ""}`}
      >
        {DISPLAY_CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
