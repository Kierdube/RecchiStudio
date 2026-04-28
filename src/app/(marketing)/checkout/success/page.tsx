import Link from "next/link";

import { MarketingShell } from "@/components/MarketingShell";

type Props = { searchParams: Promise<{ session_id?: string }> };

function SuccessMark() {
  return (
    <div
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C5E6A6] text-[#19371E] shadow-inner ring-2 ring-[#19371E]/10"
      aria-hidden
    >
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25">
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;

  return (
    <MarketingShell>
      <div className="py-6 text-center">
        <SuccessMark />
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#2d5a36]/85">
          Thank you
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
          Payment received
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[#19371E]/75">
          Stripe has confirmed your checkout. You will get a receipt by email from Stripe with your
          line items.
        </p>
        {sessionId ? (
          <p className="mx-auto mt-6 max-w-lg break-all text-left text-xs text-[#19371E]/38 sm:text-center">
            Reference: {sessionId}
          </p>
        ) : null}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalog"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-7 text-sm font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36]"
          >
            Continue shopping
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white px-7 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
          >
            Back home
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
