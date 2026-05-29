import { DEFAULT_DISPLAY_CURRENCY, type DisplayCurrencyCode } from "@/lib/currency";
import {
  convertDisplayDollarsToUsdCents,
  convertUsdCents,
  fetchUsdExchangeRates,
  formatMinorUnits,
} from "@/lib/exchange-rates";

/** Admin UI uses the same default display currency as the storefront. */
export const ADMIN_PRICE_CURRENCY = DEFAULT_DISPLAY_CURRENCY;

export function adminPriceLabel(currency: DisplayCurrencyCode = ADMIN_PRICE_CURRENCY): string {
  return `Price (${currency})`;
}

export async function getAdminExchangeRates(): Promise<Record<string, number>> {
  const payload = await fetchUsdExchangeRates("static");
  return payload.rates;
}

export function formatUsdCentsForAdmin(
  usdCents: number,
  rates: Record<string, number>,
  currency: DisplayCurrencyCode = ADMIN_PRICE_CURRENCY,
): string {
  const minor = convertUsdCents(usdCents, currency, rates);
  return formatMinorUnits(minor, currency);
}

export function usdCentsToAdminDollars(
  usdCents: number,
  rates: Record<string, number>,
  currency: DisplayCurrencyCode = ADMIN_PRICE_CURRENCY,
): string {
  const minor = convertUsdCents(usdCents, currency, rates);
  return (minor / 100).toFixed(2);
}

export function adminDollarsToUsdCents(
  adminDollars: number,
  rates: Record<string, number>,
  currency: DisplayCurrencyCode = ADMIN_PRICE_CURRENCY,
): number {
  return convertDisplayDollarsToUsdCents(adminDollars, currency, rates);
}
