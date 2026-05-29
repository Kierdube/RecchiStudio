import { DEFAULT_DISPLAY_CURRENCY, type DisplayCurrencyCode } from "@/lib/currency";
import { formatMinorUnits } from "@/lib/exchange-rates";

/** Admin UI uses the same default display currency as the storefront. */
export const ADMIN_PRICE_CURRENCY = DEFAULT_DISPLAY_CURRENCY;

export function adminPriceLabel(currency: DisplayCurrencyCode = ADMIN_PRICE_CURRENCY): string {
  return `Price (${currency})`;
}

export function formatCatalogCentsForAdmin(cadCents: number): string {
  return formatMinorUnits(cadCents, ADMIN_PRICE_CURRENCY);
}

export function catalogCentsToAdminDollars(cadCents: number): string {
  return (cadCents / 100).toFixed(2);
}

export function adminDollarsToCatalogCents(adminDollars: number): number {
  return Math.round(adminDollars * 100);
}
