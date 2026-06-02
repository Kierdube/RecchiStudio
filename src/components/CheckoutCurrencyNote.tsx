"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";

export function CheckoutCurrencyNote({ className }: { className?: string }) {
  const ctx = useOptionalCurrency();
  if (!ctx) return null;
  const { currency } = ctx;
  if (currency === "CAD") return null;
  return (
    <p className={`text-xs leading-relaxed text-[#19371E]/50 ${className ?? "mt-3"}`}>
      Prices shown in {currency}. Checkout is charged in Canadian dollars (CAD).
    </p>
  );
}
