/** Catalog / Stripe amounts are stored as USD minor units (cents). */
export const SHOP_PRICE_CURRENCY = "USD" as const;

export const DISPLAY_CURRENCIES = [
  { code: "CAD" as const, label: "CAD" },
  { code: "USD" as const, label: "USD" },
  { code: "EUR" as const, label: "EUR" },
  { code: "GBP" as const, label: "GBP" },
] as const;

export type DisplayCurrencyCode = (typeof DISPLAY_CURRENCIES)[number]["code"];

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrencyCode = "CAD";

export const CURRENCY_COOKIE = "rs_currency";

const DISPLAY_SET = new Set<string>(DISPLAY_CURRENCIES.map((c) => c.code));

export function isDisplayCurrency(code: string | undefined): code is DisplayCurrencyCode {
  return code !== undefined && DISPLAY_SET.has(code);
}

export function localeForCurrency(code: DisplayCurrencyCode): string {
  switch (code) {
    case "CAD":
      return "en-CA";
    case "EUR":
      return "de-DE";
    case "GBP":
      return "en-GB";
    default:
      return "en-US";
  }
}

/** Approximate USD→X when the rates API is unavailable (refreshed on success). */
export const FALLBACK_USD_RATES: Record<Exclude<DisplayCurrencyCode, "USD">, number> = {
  CAD: 1.38,
  EUR: 0.93,
  GBP: 0.79,
};
