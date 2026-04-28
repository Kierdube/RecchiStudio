import Link from "next/link";

import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const count = await prisma.product.count();
  const published = await prisma.product.count({ where: { published: true } });
  const messageCount = await prisma.contactSubmission.count();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-zinc-600">
        Snapshot of products and messages. Wording for the public site lives in{" "}
        <Link href="/admin/site-copy" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Site copy
        </Link>{" "}
        and{" "}
        <Link href="/admin/products" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Products
        </Link>
        .
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Products</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{count}</p>
          <p className="mt-1 text-sm text-zinc-600">{published} published</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            Manage products →
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Contact</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{messageCount}</p>
          <p className="mt-1 text-sm text-zinc-600">form submissions</p>
          <Link
            href="/admin/messages"
            className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            Open inbox →
          </Link>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:col-span-1">
          <p className="text-sm font-medium text-zinc-500">Payments</p>
          <p className="mt-2 text-sm text-zinc-700">
            Checkout uses{" "}
            <a
              href="https://stripe.com/docs/checkout"
              className="font-medium text-zinc-900 underline"
              target="_blank"
              rel="noreferrer"
            >
              Stripe Checkout
            </a>
            . Set <code className="rounded bg-zinc-100 px-1">STRIPE_SECRET_KEY</code> in{" "}
            <code className="rounded bg-zinc-100 px-1">.env</code>.
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">What to edit where</p>
        <ul className="mt-4 space-y-3 text-sm text-zinc-600">
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-semibold tabular-nums text-zinc-400">1</span>
            <span>
              <Link href="/admin/site-copy" className="font-semibold text-zinc-900 underline-offset-2 hover:underline">
                Site copy
              </Link>
              — homepage, catalog, nav, footer, page intros, SEO, legal MDX.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-semibold tabular-nums text-zinc-400">2</span>
            <span>
              <Link href="/admin/products" className="font-semibold text-zinc-900 underline-offset-2 hover:underline">
                Products
              </Link>
              — names, photos, prices, rich descriptions.
            </span>
          </li>
        </ul>
        <p className="mt-4 border-t border-zinc-100 pt-4 text-xs leading-relaxed text-zinc-500">
          Policies and shipping on the site use MDX from Site copy. Files in{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[11px] text-zinc-700">content/</code> are
          optional backups you can paste into Site copy if you like.
        </p>
      </div>
      <div className="mt-8">
        <Link
          href="/admin/products"
          className="inline-flex rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Manage products
        </Link>
      </div>
    </main>
  );
}
