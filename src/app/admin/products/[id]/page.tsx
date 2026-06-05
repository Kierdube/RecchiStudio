import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { catalogCentsToAdminDollars } from "@/lib/admin-pricing";

import { DuplicateProductForm } from "../DuplicateProductForm";
import { EditProductForm } from "../EditProductForm";
import { productPreviewUrl } from "@/lib/product-preview";

function storefrontProductHref(slug: string) {
  return `/products/${slug}`;
}

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();
  const priceCad = catalogCentsToAdminDollars(product.priceCents);

  return (
    <main className="px-4 py-10 sm:px-6">
      <Link href="/admin/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
        ← Products
      </Link>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Edit product</h1>
        {product.published ? (
          <Link
            href={storefrontProductHref(product.slug)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline"
          >
            View on storefront ↗
          </Link>
        ) : product.previewToken ? (
          <Link
            href={productPreviewUrl(product.slug, product.previewToken)}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline"
          >
            Open draft preview ↗
          </Link>
        ) : (
          <span className="text-sm text-zinc-500">Save to generate a preview link</span>
        )}
      </div>
      <div className="mt-4">
        <DuplicateProductForm id={product.id} name={product.name} />
      </div>
      <div className="mt-8">
        <EditProductForm product={product} priceCad={priceCad} />
      </div>
    </main>
  );
}
