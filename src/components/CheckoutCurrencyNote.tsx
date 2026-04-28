"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";

export function CheckoutCurrencyNote() {
  const ctx = useOptionalCurrency();
  if (!ctx) return null;
  const { currency } = ctx;
  if (currency === "USD") return null;
  return (
    <p className="mt-3 text-xs leading-relaxed text-[#19371E]/50">
      Prices shown are converted for reference. Checkout is charged in US dollars at the catalog
      USD amount.
    </p>
  );
}
