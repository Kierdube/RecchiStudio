import Link from "next/link";

import { categoryLabelForSlug } from "@/lib/catalog";
import { primaryProductImage } from "@/lib/product-images";
import { prisma } from "@/lib/prisma";

import { DeleteProductForm } from "./DeleteProductForm";
import { ImportProductsButton } from "./ImportProductsButton";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Edit names, long descriptions, USD prices, collection, and photo URLs — multiple per
            product, with previews on the edit screen.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ImportProductsButton />
          <Link
            href="/admin/products/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            New product
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[36rem] divide-y divide-zinc-200 text-sm sm:min-w-full">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="w-14 px-4 py-3" aria-label="Photo" />
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
                  No products yet.{" "}
                  <Link href="/admin/products/new" className="font-medium text-zinc-900 underline">
                    Add one
                  </Link>
                  .
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const thumb = primaryProductImage(p.imageUrls);
                return (
                <tr key={p.id} className="text-zinc-800">
                  <td className="px-4 py-2">
                    <div className="h-11 w-11 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{p.slug}</td>
                  <td className="px-4 py-3 text-zinc-600">{categoryLabelForSlug(p.categorySlug)}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(p.priceCents)}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex min-h-9 min-w-[3.25rem] items-center justify-center rounded-md border border-zinc-300 px-2 py-1.5 text-xs font-medium touch-manipulation hover:bg-zinc-50"
                      >
                        Edit
                      </Link>
                      <DeleteProductForm id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
