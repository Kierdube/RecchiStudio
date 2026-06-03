import Link from "next/link";

import { CartLink } from "@/components/CartLink";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { SiteLogo, SITE_LOGO_SIZE_CLASS } from "@/components/SiteLogo";
import { siteCopyGet } from "@/lib/site-copy";

export function SiteHeader({ copy }: { copy: Record<string, string> }) {
  const brandTitle = siteCopyGet(copy, "footer.brand_title");
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
        <Link href="/" className="group flex min-w-0 items-center">
          <SiteLogo alt={brandTitle} href={null} className={SITE_LOGO_SIZE_CLASS} />
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
            <Link href="/catalog" className="rounded-md py-2 transition hover:bg-[#19371E]/5 hover:text-[#2d5a36]">
              {navCatalog}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <CartLink />
            <CurrencySwitcher className="shrink-0" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <CurrencySwitcher className="shrink-0" />
          <CartLink />
          <details className="relative">
          <summary className="flex list-none min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-[#19371E]/15 bg-white px-4 py-2 text-sm font-semibold text-[#19371E] shadow-sm touch-manipulation [&::-webkit-details-marker]:hidden">
            {menuBtn}
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-[min(calc(100vw-2rem),18rem)] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#19371E]/10 bg-white py-3 text-sm shadow-lg">
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
      </div>
    </header>
  );
}
