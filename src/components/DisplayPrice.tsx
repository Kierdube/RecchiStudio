"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";
import { DEFAULT_DISPLAY_CURRENCY, FALLBACK_USD_RATES } from "@/lib/currency";
import { convertUsdCents, formatMinorUnits } from "@/lib/exchange-rates";

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
    : formatMinorUnits(
        convertUsdCents(usdCents, DEFAULT_DISPLAY_CURRENCY, FALLBACK_USD_RATES),
        DEFAULT_DISPLAY_CURRENCY,
      );
  return <span className={className}>{text}</span>;
}
