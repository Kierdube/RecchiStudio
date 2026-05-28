import type { Metadata } from "next";
import Link from "next/link";

import { FeatureIcon } from "@/components/FeatureIcon";
import { SiteCopyText } from "@/components/SiteCopyText";
import { MarketingShell } from "@/components/MarketingShell";
import { PageIntro } from "@/components/PageIntro";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { getSiteCopyRecord, resolveSiteCopyImageUrl, siteCopyGet } from "@/lib/site-copy";

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
  const storyImageUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "about.body.image_url"));
  const storyImageAlt = siteCopyGet(copy, "about.body.image_alt");

  return (
    <MarketingShell>
      <PageIntro
        eyebrow={siteCopyGet(copy, "about.intro.eyebrow")}
        eyebrowUppercase={false}
        title={siteCopyGet(copy, "about.intro.title")}
        description={siteCopyGet(copy, "about.intro.description")}
      />

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 xl:gap-16">
        <SiteCopyHtml
          html={siteCopyGet(copy, "about.body_html")}
          className="space-y-6 text-base leading-relaxed text-[#19371E]/82 [&_p]:m-0"
        />
        {storyImageUrl ? (
          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:justify-self-end">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] shadow-[0_28px_80px_-40px_rgba(25,55,30,0.35)] ring-1 ring-[#19371E]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storyImageUrl}
                alt={storyImageAlt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>

      <ul className="mt-12 grid gap-5 sm:grid-cols-3">
        {FEATURE_KINDS.map((kind, i) => {
          const n = i + 1;
          return (
            <li
              key={kind}
              className="flex flex-col items-center rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 text-center shadow-sm ring-1 ring-black/[0.02] sm:items-start sm:text-left"
            >
              <FeatureIcon kind={kind} />
              <p className="mt-4 font-semibold text-[#19371E]">
                <SiteCopyText value={siteCopyGet(copy, `about.feature.${n}.title`)} inline />
              </p>
              <p className="mt-2 text-sm text-[#19371E]/70">
                <SiteCopyText value={siteCopyGet(copy, `about.feature.${n}.body`)} inline />
              </p>
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
