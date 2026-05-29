"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";

export function CheckoutCurrencyNote() {
  const ctx = useOptionalCurrency();
  if (!ctx) return null;
  const { currency } = ctx;
  if (currency === "USD") return null;
  return (
    <p className="mt-3 text-xs leading-relaxed text-[#19371E]/50">
      Prices shown in Canadian dollars. Checkout is processed in US dollars by our payment provider.
    </p>
  );
}
