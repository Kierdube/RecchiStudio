import Link from "next/link";

import { MarketingShell } from "@/components/MarketingShell";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteCopyRecord } from "@/lib/site-copy";

/**
 * Global 404 for routes outside the marketing segment (e.g. mistyped `/admin/...` URLs).
 * Storefront routes that call `notFound()` still use `(marketing)/not-found.tsx` when applicable.
 */
export default async function RootNotFound() {
  const copy = await getSiteCopyRecord();
  return (
    <>
      <SiteHeader copy={copy} />
      <div className="flex-1">
        <MarketingShell>
          <div className="py-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2d5a36]/75">
              404
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#19371E] sm:text-4xl">
              Page not found
            </h1>
            <p className="mx-auto mt-4 max-w-md text-[#19371E]/72">
              That URL does not exist on this site. If you were looking for the storefront, head to
              the catalog; for admin tools, open the dashboard.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-7 text-sm font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36]"
              >
                Home
              </Link>
              <Link
                href="/catalog"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white px-7 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
              >
                Catalog
              </Link>
              <Link
                href="/admin"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white px-7 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
              >
                Admin
              </Link>
            </div>
          </div>
        </MarketingShell>
      </div>
      <SiteFooter copy={copy} />
    </>
  );
}
