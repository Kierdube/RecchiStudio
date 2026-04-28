import { NextResponse } from "next/server";

import { fetchUsdExchangeRates } from "@/lib/exchange-rates";

export async function GET() {
  const data = await fetchUsdExchangeRates("live");
  return NextResponse.json(data);
}
