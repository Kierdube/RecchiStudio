import { cookies } from "next/headers";

import { GoogleFontsLoader } from "@/components/GoogleFontsLoader";
import { SiteFooter } from "@/components/SiteFooter";
import { GlobalTypographyStyles } from "@/components/GlobalTypographyStyles";
import { googleFontsUsedInSiteCopy } from "@/lib/google-fonts";
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

  const googleFonts = googleFontsUsedInSiteCopy(copy);

  return (
    <CurrencyProvider
      initialRates={ratesPayload.rates}
      ratesAsOf={ratesPayload.asOf}
      initialCurrency={initialCurrency}
    >
      <GoogleFontsLoader fonts={googleFonts} />
      <GlobalTypographyStyles copy={copy} />
      <SiteHeader copy={copy} />
      <div
        data-recchi-content
        className="min-w-0 flex-1 bg-background [--site-header-offset:calc(env(safe-area-inset-top,0px)+4.875rem+1px)] sm:[--site-header-offset:calc(env(safe-area-inset-top,0px)+5.75rem+1px)]"
      >
        {children}
      </div>
      <SiteFooter copy={copy} />
    </CurrencyProvider>
  );
}
