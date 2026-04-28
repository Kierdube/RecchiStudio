import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FeatureIcon } from "@/components/FeatureIcon";
import { MarketingShell } from "@/components/MarketingShell";
import { PageIntro } from "@/components/PageIntro";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { getSiteCopyRecord, siteCopyGet } from "@/lib/site-copy";

const FEATURE_KINDS = ["cotton", "design", "nature"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "about.meta_title"),
    description: siteCopyGet(copy, "about.meta_description"),
  };
}

export default async function AboutPage() {
  const copy = await getSiteCopyRecord();

  return (
    <MarketingShell>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <PageIntro
        eyebrow={siteCopyGet(copy, "about.intro.eyebrow")}
        title={siteCopyGet(copy, "about.intro.title")}
        description={siteCopyGet(copy, "about.intro.description")}
      />

      <SiteCopyHtml
        html={siteCopyGet(copy, "about.body_html")}
        className="space-y-6 text-base leading-relaxed text-[#19371E]/82 [&_p]:m-0"
      />

      <ul className="mt-12 grid gap-5 sm:grid-cols-3">
        {FEATURE_KINDS.map((kind, i) => {
          const n = i + 1;
          return (
            <li
              key={kind}
              className="flex flex-col items-center rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 text-center shadow-sm ring-1 ring-black/[0.02] sm:items-start sm:text-left"
            >
              <FeatureIcon kind={kind} />
              <p className="mt-4 font-semibold text-[#19371E]">{siteCopyGet(copy, `about.feature.${n}.title`)}</p>
              <p className="mt-2 text-sm text-[#19371E]/70">{siteCopyGet(copy, `about.feature.${n}.body`)}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-14 flex flex-wrap gap-3">
        <Link
          href="/catalog"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#19371E] px-6 text-sm font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36]"
        >
          {siteCopyGet(copy, "about.cta_catalog")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#19371E]/18 bg-white px-6 text-sm font-semibold text-[#19371E] transition hover:bg-[#F4F9EF]"
        >
          {siteCopyGet(copy, "about.cta_contact")}
        </Link>
      </div>
    </MarketingShell>
  );
}
