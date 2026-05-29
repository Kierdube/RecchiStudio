import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getAdminExchangeRates, usdCentsToAdminDollars } from "@/lib/admin-pricing";

import { EditProductForm } from "../EditProductForm";

function storefrontProductHref(slug: string) {
  return `/products/${slug}`;
}

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, rates] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    getAdminExchangeRates(),
  ]);
  if (!product) notFound();
  const priceCad = usdCentsToAdminDollars(product.priceCents, rates);

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
        ) : (
          <span className="text-sm text-zinc-500">Publish to get a public link</span>
        )}
      </div>
      <div className="mt-8">
        <EditProductForm product={product} priceCad={priceCad} />
      </div>
    </main>
  );
}
