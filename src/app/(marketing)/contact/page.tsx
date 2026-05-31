import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { MarketingShell } from "@/components/MarketingShell";
import { PageIntro } from "@/components/PageIntro";
import { SiteCopyHtml } from "@/components/SiteCopyHtml";
import { isRichTextHtmlEmpty } from "@/lib/rich-text-sanitize";
import { getSiteCopyRecord, resolveSiteCopyImageUrl, siteCopyGet } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "contact.meta_title"),
    description: siteCopyGet(copy, "contact.meta_description"),
  };
}

export default async function ContactPage() {
  const copy = await getSiteCopyRecord();
  const sidebarImageUrl = resolveSiteCopyImageUrl(siteCopyGet(copy, "contact.sidebar.image_url"));
  const sidebarImageAlt = siteCopyGet(copy, "contact.sidebar.image_alt");
  const noteHtmlRaw = siteCopyGet(copy, "contact.sidebar.note_html");
  const noteHtml =
    /replace this address with yours/i.test(noteHtmlRaw) || isRichTextHtmlEmpty(noteHtmlRaw)
      ? ""
      : noteHtmlRaw;

  return (
    <MarketingShell>
      <PageIntro
        eyebrow={siteCopyGet(copy, "contact.intro.eyebrow")}
        title={siteCopyGet(copy, "contact.intro.title")}
        description={siteCopyGet(copy, "contact.intro.description")}
      />

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-6 rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 shadow-sm ring-1 ring-black/[0.02] sm:p-8 lg:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#19371E]/55">
            {siteCopyGet(copy, "contact.sidebar.direct_heading")}
          </h2>
          {sidebarImageUrl ? (
            <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-[#F4F9EF] to-[#E8F0DD] shadow-sm ring-1 ring-[#19371E]/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sidebarImageUrl}
                alt={sidebarImageAlt}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          ) : null}
          {noteHtml ? (
            <SiteCopyHtml
              html={noteHtml}
              className="text-sm text-[#19371E]/60 [&_code]:rounded [&_code]:bg-[#19371E]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs"
            />
          ) : null}
        </div>

        <div className="rounded-2xl border border-[#19371E]/10 bg-white/90 p-6 ring-1 ring-[#19371E]/5 sm:p-8 lg:col-span-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#19371E]/55">
            {siteCopyGet(copy, "contact.form.heading")}
          </h2>
          <ContactForm />
        </div>
      </div>

      <SiteCopyHtml
        html={siteCopyGet(copy, "contact.footer_html")}
        className="mt-12 text-center text-sm text-[#19371E]/55 [&_a]:font-semibold [&_a]:text-[#2d5a36] [&_a]:underline-offset-2 hover:[&_a]:underline"
      />
    </MarketingShell>
  );
}
