import Link from "next/link";

import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { siteCopyGet } from "@/lib/site-copy";

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 106.53 122.88"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4.93 30.34h22.48v-4.58a25.77 25.77 0 0 1 51.53 0v4.58h22.66a4.91 4.91 0 0 1 4.91 4.94v69.9a17.75 17.75 0 0 1-17.7 17.7H17.7A17.75 17.75 0 0 1 0 105.18V35.28a4.91 4.91 0 0 1 4.92-4.94zm28.76 0h39v-4.58a19.49 19.49 0 0 0-39 0v4.58zm-6.28 13v-6.72H6.28v62h94V36.62H78.94v6.76a6.48 6.48 0 1 1-6.28-.12V36.62h-39v6.71a6.48 6.48 0 1 1-6.28 0z" />
    </svg>
  );
}

export function SiteHeader({ copy }: { copy: Record<string, string> }) {
  const tagline = siteCopyGet(copy, "header.tagline");
  const navAbout = siteCopyGet(copy, "header.nav.about");
  const navShipping = siteCopyGet(copy, "header.nav.shipping");
  const navContact = siteCopyGet(copy, "header.nav.contact");
  const navCatalog = siteCopyGet(copy, "header.nav.catalog");
  const navPolicies = siteCopyGet(copy, "header.nav.policies");
  const navHome = siteCopyGet(copy, "header.nav.home");
  const menuBtn = siteCopyGet(copy, "header.menu_button");

  return (
    <header className="sticky top-0 z-40 border-b border-[#19371E]/10 bg-[#FDFCF8]/85 pt-[env(safe-area-inset-top,0px)] shadow-sm shadow-[#19371E]/[0.03] backdrop-blur-md supports-[backdrop-filter]:bg-[#FDFCF8]/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19371E] text-sm font-bold tracking-tight text-[#C5E6A6] shadow-inner ring-1 ring-[#19371E]/20 transition group-hover:bg-[#2d5a36]">
            RS
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-tight text-[#19371E] sm:text-xl">
              Recchi Studio
            </span>
            <span className="hidden text-xs font-medium text-[#2d5a36]/80 sm:block">{tagline}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-5 sm:flex lg:gap-7">
          <nav className="flex items-center gap-4 text-sm font-medium text-[#19371E] lg:gap-8">
            <Link href="/about" className="rounded-md py-2 transition hover:bg-[#19371E]/5 hover:text-[#2d5a36]">
              {navAbout}
            </Link>
            <Link href="/shipping" className="rounded-md py-2 transition hover:bg-[#19371E]/5 hover:text-[#2d5a36]">
              {navShipping}
            </Link>
            <Link href="/contact" className="rounded-md py-2 transition hover:bg-[#19371E]/5 hover:text-[#2d5a36]">
              {navContact}
            </Link>
            <Link
              href="/catalog"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#19371E]/15 bg-white px-4 py-2 text-[#19371E] shadow-sm transition hover:border-[#19371E]/25 hover:shadow touch-manipulation"
            >
              <BagIcon className="h-4 w-4 opacity-80" />
              <span>{navCatalog}</span>
            </Link>
          </nav>
          <CurrencySwitcher className="shrink-0" />
        </div>

        <details className="relative sm:hidden">
          <summary className="flex list-none min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#19371E]/15 bg-white px-4 py-2 text-sm font-semibold text-[#19371E] shadow-sm touch-manipulation [&::-webkit-details-marker]:hidden">
            {menuBtn}
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-[min(calc(100vw-2rem),18rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#19371E]/10 bg-white py-3 text-sm shadow-lg">
            <div className="border-b border-[#19371E]/8 px-4 pb-3">
              <CurrencySwitcher layout="stacked" />
            </div>
            <Link href="/catalog" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navCatalog}
            </Link>
            <Link href="/about" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navAbout}
            </Link>
            <Link href="/shipping" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navShipping}
            </Link>
            <Link href="/policies" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navPolicies}
            </Link>
            <Link href="/contact" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navContact}
            </Link>
            <Link href="/" className="flex min-h-11 items-center px-4 py-2 font-medium hover:bg-[#F4F9EF]">
              {navHome}
            </Link>
          </div>
        </details>
      </div>
    </header>
  );
}
