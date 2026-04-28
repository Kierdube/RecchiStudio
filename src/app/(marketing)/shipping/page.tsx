import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MarketingShell } from "@/components/MarketingShell";
import { MdxArticle } from "@/components/MdxArticle";
import { compileMdxFromString, loadMdxFromRoot } from "@/lib/load-mdx";
import { getSiteCopyRecord, siteCopyGet } from "@/lib/site-copy";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getSiteCopyRecord();
  return {
    title: siteCopyGet(copy, "shipping.meta_title"),
    description: siteCopyGet(copy, "shipping.meta_description"),
  };
}

export default async function ShippingPage() {
  const copy = await getSiteCopyRecord();
  const fromDb = siteCopyGet(copy, "legal.shipping_mdx").trim();
  let content: Awaited<ReturnType<typeof compileMdxFromString>>["content"];
  if (fromDb) {
    try {
      content = (await compileMdxFromString(fromDb)).content;
    } catch {
      // If saved MDX is invalid, fall back to the checked-in content page.
      content = (await loadMdxFromRoot("content/shipping.mdx")).content;
    }
  } else {
    content = (await loadMdxFromRoot("content/shipping.mdx")).content;
  }

  return (
    <MarketingShell wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shipping & Returns" }]} />
      <MdxArticle>{content}</MdxArticle>
    </MarketingShell>
  );
}
