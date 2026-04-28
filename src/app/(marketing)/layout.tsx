import { cookies } from "next/headers";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteCopyRecord } from "@/lib/site-copy";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import {
  CURRENCY_COOKIE,
  DEFAULT_DISPLAY_CURRENCY,
  isDisplayCurrency,
} from "@/lib/currency";
import { fetchUsdExchangeRates } from "@/lib/exchange-rates";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ratesPayload, cookieStore, copy] = await Promise.all([
    fetchUsdExchangeRates("static"),
    cookies(),
    getSiteCopyRecord(),
  ]);
  const cookieCurrency = cookieStore.get(CURRENCY_COOKIE)?.value;
  const initialCurrency = isDisplayCurrency(cookieCurrency)
    ? cookieCurrency
    : DEFAULT_DISPLAY_CURRENCY;

  return (
    <CurrencyProvider
      initialRates={ratesPayload.rates}
      ratesAsOf={ratesPayload.asOf}
      initialCurrency={initialCurrency}
    >
      <SiteHeader copy={copy} />
      <div className="min-w-0 flex-1">{children}</div>
      <SiteFooter copy={copy} />
    </CurrencyProvider>
  );
}
