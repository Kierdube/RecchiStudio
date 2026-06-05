import Link from "next/link";

import { SiteLogo, SITE_LOGO_SIZE_CLASS } from "@/components/SiteLogo";
import { siteCopyGet } from "@/lib/site-copy";

const pageHrefs = [
  { key: "footer.nav.shipping", href: "/shipping" },
  { key: "footer.nav.policies", href: "/policies" },
  { key: "footer.nav.about", href: "/about" },
  { key: "footer.nav.contact", href: "/contact" },
] as const;

export function SiteFooter({ copy }: { copy: Record<string, string> }) {
  const brandTitle = siteCopyGet(copy, "footer.brand_title");
  const brandBlurb = siteCopyGet(copy, "footer.brand_blurb");
  const sectionPages = siteCopyGet(copy, "footer.section_pages");
  const sectionCatalog = siteCopyGet(copy, "footer.section_catalog");
  const catalogBlurb = siteCopyGet(copy, "footer.catalog_blurb");
  const catalogCta = siteCopyGet(copy, "footer.catalog_cta");
  const copyright = siteCopyGet(copy, "footer.copyright");

  return (
    <footer className="mt-auto border-t border-[#19371E]/20 bg-[#142a18] text-[#E8F5D4]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <SiteLogo alt={brandTitle} onDark className={SITE_LOGO_SIZE_CLASS} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#C5E6A6]/85">{brandBlurb}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C5E6A6]/60">
              {sectionCatalog}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#C5E6A6]/85">{catalogBlurb}</p>
            <Link
              href="/catalog"
              className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-[#C5E6A6] underline-offset-4 hover:underline touch-manipulation"
            >
              {catalogCta}
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C5E6A6]/60">
              {sectionPages}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {pageHrefs.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="-mx-1 block rounded-md px-1 py-2 text-[#E8F5D4]/90 transition hover:bg-white/5 hover:text-white"
                  >
                    {siteCopyGet(copy, item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center text-xs text-[#C5E6A6]/55">
        © {new Date().getFullYear()} {copyright}
      </div>
    </footer>
  );
}
