import {
  FALLBACK_USD_RATES,
  localeForCurrency,
  type DisplayCurrencyCode,
} from "@/lib/currency";

const FRANKFURTER =
  "https://api.frankfurter.app/latest?from=USD&to=CAD,EUR,GBP";

export type UsdExchangeRates = {
  /** Multipliers from Frankfurter: 1 USD → `rates.CAD` Canadian dollars (not cents). */
  rates: Record<string, number>;
  asOf: string;
};

function mergedRates(api: Record<string, number> | undefined): Record<string, number> {
  return { ...FALLBACK_USD_RATES, ...(api ?? {}) };
}

export async function fetchUsdExchangeRates(
  cacheMode: "static" | "live" = "static",
): Promise<UsdExchangeRates> {
  const fetchInit =
    cacheMode === "static"
      ? ({ next: { revalidate: 3600 } } as const)
      : ({ cache: "no-store" } as const);
  try {
    const res = await fetch(FRANKFURTER, fetchInit);
    if (!res.ok) throw new Error(`Frankfurter ${res.status}`);
    const data = (await res.json()) as {
      date?: string;
      rates?: Partial<Record<DisplayCurrencyCode, number>>;
    };
    return {
      rates: mergedRates(data.rates as Record<string, number> | undefined),
      asOf: data.date ?? new Date().toISOString().slice(0, 10),
    };
  } catch {
    return {
      rates: mergedRates(undefined),
      asOf: "unavailable",
    };
  }
}

/** USD catalog cents → target currency minor units (cents/pence). */
export function convertUsdCents(usdCents: number, target: DisplayCurrencyCode, rates: Record<string, number>): number {
  if (target === "USD") return usdCents;
  const r = rates[target];
  if (!r || !Number.isFinite(r)) return Math.round(usdCents * (FALLBACK_USD_RATES[target] ?? 1));
  return Math.round(usdCents * r);
}

export function formatMinorUnits(minor: number, currency: DisplayCurrencyCode): string {
  return new Intl.NumberFormat(localeForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}
