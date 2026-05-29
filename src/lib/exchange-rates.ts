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

/** CAD catalog cents → target currency minor units (cents/pence). */
export function convertCatalogCents(
  cadCents: number,
  target: DisplayCurrencyCode,
  rates: Record<string, number>,
): number {
  if (target === "CAD") return cadCents;
  const usdToCad = rates.CAD ?? FALLBACK_USD_RATES.CAD;
  const usdCents = Math.round(cadCents / usdToCad);
  if (target === "USD") return usdCents;
  return convertUsdMinorToTarget(usdCents, target, rates);
}

function convertUsdMinorToTarget(
  usdCents: number,
  target: Exclude<DisplayCurrencyCode, "USD" | "CAD">,
  rates: Record<string, number>,
): number {
  const r = rates[target];
  if (!r || !Number.isFinite(r)) {
    return Math.round(usdCents * FALLBACK_USD_RATES[target]);
  }
  return Math.round(usdCents * r);
}

/** Display currency dollars (e.g. catalog min/max filter) → CAD catalog cents. */
export function convertDisplayDollarsToCatalogCents(
  displayDollars: number,
  source: DisplayCurrencyCode,
  rates: Record<string, number>,
): number {
  const displayMinor = Math.round(displayDollars * 100);
  if (source === "CAD") return displayMinor;
  if (source === "USD") {
    const usdToCad = rates.CAD ?? FALLBACK_USD_RATES.CAD;
    return Math.round(displayMinor * usdToCad);
  }
  const usdCents = convertDisplayDollarsToUsdCents(displayDollars, source, rates);
  const usdToCad = rates.CAD ?? FALLBACK_USD_RATES.CAD;
  return Math.round(usdCents * usdToCad);
}

/** Display currency dollars → USD catalog cents (internal helper for cross-rates). */
export function convertDisplayDollarsToUsdCents(
  displayDollars: number,
  source: DisplayCurrencyCode,
  rates: Record<string, number>,
): number {
  const displayMinor = Math.round(displayDollars * 100);
  if (source === "USD") return displayMinor;
  const r = rates[source] ?? FALLBACK_USD_RATES[source as Exclude<DisplayCurrencyCode, "USD">];
  if (!r || !Number.isFinite(r)) return displayMinor;
  return Math.round(displayMinor / r);
}

export function formatMinorUnits(minor: number, currency: DisplayCurrencyCode): string {
  return new Intl.NumberFormat(localeForCurrency(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}
