import Link from "next/link";

import { MarketingShell } from "@/components/MarketingShell";

export default function MarketingNotFound() {
  return (
    <MarketingShell>
      <div className="py-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2d5a36]/75">404</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
          This page drifted away
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[#19371E]/72">
          The link may be old or the product might be unpublished. Try the catalog or head home.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/catalog"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-6 text-sm font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36]"
          >
            Go to catalog
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white px-6 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
          >
            Back home
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
