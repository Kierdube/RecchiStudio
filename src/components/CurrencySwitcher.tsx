"use client";

import { ChevronDown } from "lucide-react";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";
import { DISPLAY_CURRENCIES, type DisplayCurrencyCode } from "@/lib/currency";

export function CurrencySwitcher({
  className,
  layout = "inline",
  variant = "light",
}: {
  className?: string;
  /** `stacked`: full-width controls (e.g. mobile menu). */
  layout?: "inline" | "stacked";
  /** `dark` for footer / dark backgrounds. */
  variant?: "light" | "dark";
}) {
  const ctx = useOptionalCurrency();
  if (!ctx) return null;
  const { currency, setCurrency } = ctx;

  const stacked = layout === "stacked";
  const isDark = variant === "dark";
  const controlClass = isDark
    ? "text-[#C5E6A6] focus:ring-2 focus:ring-[#C5E6A6]/40"
    : "text-[#19371E] focus:ring-2 focus:ring-[#C5E6A6]/80";
  const chevronClass = isDark ? "text-[#C5E6A6]/80" : "text-[#19371E]";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${stacked ? "flex-col items-stretch gap-3" : ""} ${className ?? ""}`}
    >
      <label className="sr-only" htmlFor="currency-select">
        Display currency
      </label>
      <div className={`relative inline-flex items-center ${stacked ? "w-full" : ""}`}>
        <select
          id="currency-select"
          value={currency}
          onChange={(e) => setCurrency(e.target.value as DisplayCurrencyCode)}
          className={`cursor-pointer appearance-none border-0 bg-transparent py-2 pl-0 pr-3.5 text-sm font-semibold tracking-wide outline-none transition sm:py-1.5 sm:text-xs ${controlClass} ${stacked ? "min-h-11 w-full" : ""}`}
        >
          {DISPLAY_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 ${chevronClass}`}
          aria-hidden
        />
      </div>
    </div>
  );
}
