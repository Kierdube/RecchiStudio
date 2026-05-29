"use client";

import { useOptionalCurrency } from "@/contexts/CurrencyContext";
import { DEFAULT_DISPLAY_CURRENCY, FALLBACK_USD_RATES } from "@/lib/currency";
import { convertCatalogCents, formatMinorUnits } from "@/lib/exchange-rates";

export function DisplayPrice({
  priceCents,
  className,
}: {
  /** Stored catalog price in CAD cents. */
  priceCents: number;
  className?: string;
}) {
  const ctx = useOptionalCurrency();
  const text = ctx
    ? ctx.formatPriceCents(priceCents)
    : formatMinorUnits(
        convertCatalogCents(priceCents, DEFAULT_DISPLAY_CURRENCY, FALLBACK_USD_RATES),
        DEFAULT_DISPLAY_CURRENCY,
      );
  return <span className={className}>{text}</span>;
}
