"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";

export function DisplayPrice({
  usdCents,
  className,
}: {
  usdCents: number;
  className?: string;
}) {
  const ctx = useOptionalCurrency();
  const text = ctx
    ? ctx.formatUsdCents(usdCents)
    : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(usdCents / 100);
  return <span className={className}>{text}</span>;
}
