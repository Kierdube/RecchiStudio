"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { CURRENCY_COOKIE, type DisplayCurrencyCode } from "@/lib/currency";
import { convertUsdCents, formatMinorUnits, type UsdExchangeRates } from "@/lib/exchange-rates";

type CurrencyContextValue = {
  currency: DisplayCurrencyCode;
  setCurrency: (c: DisplayCurrencyCode) => void;
  /** Catalog amounts are USD cents; returns formatted string in the selected display currency. */
  formatUsdCents: (usdCents: number) => string;
  ratesAsOf: string;
  refreshRates: () => Promise<void>;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function setCurrencyCookie(code: DisplayCurrencyCode) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${CURRENCY_COOKIE}=${code};path=/;max-age=${maxAge};SameSite=Lax`;
}

export function CurrencyProvider({
  children,
  initialRates,
  ratesAsOf: initialAsOf,
  initialCurrency,
}: {
  children: ReactNode;
  initialRates: UsdExchangeRates["rates"];
  ratesAsOf: string;
  initialCurrency: DisplayCurrencyCode;
}) {
  const [currency, setCurrencyState] = useState<DisplayCurrencyCode>(initialCurrency);
  const [rates, setRates] = useState(initialRates);
  const [ratesAsOf, setRatesAsOf] = useState(initialAsOf);

  const setCurrency = useCallback((c: DisplayCurrencyCode) => {
    setCurrencyState(c);
    setCurrencyCookie(c);
  }, []);

  const refreshRates = useCallback(async () => {
    try {
      const res = await fetch("/api/exchange-rates", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as UsdExchangeRates;
      if (data.rates && typeof data.rates === "object") {
        setRates(data.rates);
        if (typeof data.asOf === "string") setRatesAsOf(data.asOf);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      void refreshRates();
    }, 60 * 60 * 1000);
    return () => window.clearInterval(t);
  }, [refreshRates]);

  const formatUsdCents = useCallback(
    (usdCents: number) => {
      const minor = convertUsdCents(usdCents, currency, rates);
      return formatMinorUnits(minor, currency);
    },
    [currency, rates],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatUsdCents,
      ratesAsOf,
      refreshRates,
    }),
    [currency, setCurrency, formatUsdCents, ratesAsOf, refreshRates],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}

export function useOptionalCurrency(): CurrencyContextValue | null {
  return useContext(CurrencyContext);
}
