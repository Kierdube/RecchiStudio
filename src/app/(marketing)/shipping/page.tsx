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
  const { content } = fromDb
    ? await compileMdxFromString(fromDb)
    : await loadMdxFromRoot("content/shipping.mdx");

  return (
    <MarketingShell wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shipping & Returns" }]} />
      <MdxArticle>{content}</MdxArticle>
    </MarketingShell>
  );
}
