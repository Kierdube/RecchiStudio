import Link from "next/link";

import { prisma } from "@/lib/prisma";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const [count, published, messageCount, recentProducts, recentMessages] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.contactSubmission.count(),
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, name: true, published: true, updatedAt: true },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
  ]);
  const [productsUpdated7d, productsUpdated30d, messages7d, messages30d] = await Promise.all([
    prisma.product.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
    prisma.product.count({ where: { updatedAt: { gte: thirtyDaysAgo } } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.contactSubmission.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);
  const drafts = Math.max(0, count - published);
  const setupChecks = [
    { label: "Database", ok: Boolean(process.env.DATABASE_URL) },
    { label: "Admin auth secret", ok: Boolean(process.env.AUTH_SECRET) },
    { label: "Stripe checkout", ok: Boolean(process.env.STRIPE_SECRET_KEY) },
    { label: "Public app URL", ok: Boolean(process.env.NEXT_PUBLIC_APP_URL) },
    {
      label: "Contact email alerts",
      ok:
        Boolean(process.env.RESEND_API_KEY) &&
        Boolean(process.env.CONTACT_TO_EMAIL) &&
        Boolean(process.env.RESEND_FROM_EMAIL),
    },
  ];
  const setupComplete = setupChecks.filter((check) => check.ok).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1.5 max-w-3xl text-sm text-zinc-600">
        Central control panel for catalog, messaging, and site content. Public-facing wording lives in{" "}
        <Link href="/admin/site-copy" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Site copy
        </Link>{" "}
        and{" "}
        <Link href="/admin/products" className="font-medium text-zinc-900 underline-offset-2 hover:underline">
          Products
        </Link>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products/new"
          className="inline-flex rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
        >
          Add product
        </Link>
        <Link
          href="/admin/products"
          className="inline-flex rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Manage catalog
        </Link>
        <Link
          href="/admin/site-copy"
          className="inline-flex rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Edit site copy
        </Link>
        <Link
          href="/admin/messages"
          className="inline-flex rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Open messages
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Products</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{count}</p>
          <p className="mt-1 text-sm text-zinc-600">{published} published</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Contact</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{messageCount}</p>
          <p className="mt-1 text-sm text-zinc-600">form submissions</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Draft products</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">{drafts}</p>
          <p className="mt-1 text-sm text-zinc-600">not yet visible on the storefront</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Setup complete</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums">
            {setupComplete}/{setupChecks.length}
          </p>
          <p className="mt-1 text-sm text-zinc-600">core environment checks passing</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-sm font-semibold text-zinc-900">Environment readiness</p>
          <ul className="mt-4 space-y-2 text-sm">
            {setupChecks.map((check) => (
              <li key={check.label} className="flex items-center justify-between gap-4">
                <span className="text-zinc-600">{check.label}</span>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    check.ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {check.ok ? "Configured" : "Needs setup"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-zinc-100 pt-4 text-xs leading-relaxed text-zinc-500">
            Contact notifications use{" "}
            <code className="rounded bg-zinc-100 px-1">RESEND_API_KEY</code>,{" "}
            <code className="rounded bg-zinc-100 px-1">CONTACT_TO_EMAIL</code>, and{" "}
            <code className="rounded bg-zinc-100 px-1">RESEND_FROM_EMAIL</code>. Payments require{" "}
            <code className="rounded bg-zinc-100 px-1">STRIPE_SECRET_KEY</code>.
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-sm font-semibold text-zinc-900">Recent product updates</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Last 7 days</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{productsUpdated7d}</p>
            </div>
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Last 30 days</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{productsUpdated30d}</p>
            </div>
          </div>
          {recentProducts.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No products yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentProducts.map((product) => (
                <li key={product.id} className="rounded-lg border border-zinc-100 px-3 py-2">
                  <p className="truncate text-sm font-medium text-zinc-900">{product.name}</p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {product.published ? "Published" : "Draft"} - Updated {formatDate(product.updatedAt)}
                  </p>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="mt-1 inline-block text-xs font-medium text-zinc-700 underline-offset-2 hover:underline"
                  >
                    Open item
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/products"
            className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            View all products →
          </Link>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-1">
          <p className="text-sm font-semibold text-zinc-900">Recent messages</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Last 7 days</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{messages7d}</p>
            </div>
            <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-2 py-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Last 30 days</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-zinc-900">{messages30d}</p>
            </div>
          </div>
          {recentMessages.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No messages yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentMessages.map((message) => (
                <li key={message.id} className="rounded-lg border border-zinc-100 px-3 py-2">
                  <p className="text-sm font-medium text-zinc-900">{message.name}</p>
                  <p className="mt-1 truncate text-xs text-zinc-500">{message.email}</p>
                  <p className="mt-1 text-xs text-zinc-500">Received {formatDate(message.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
          <Link
            href="/admin/messages"
            className="mt-4 inline-block text-sm font-semibold text-zinc-900 underline-offset-2 hover:underline"
          >
            Open inbox →
          </Link>
        </section>
      </div>

      <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">Editing guide</p>
        <ul className="mt-4 space-y-3 text-sm text-zinc-600">
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-semibold tabular-nums text-zinc-400">1</span>
            <span>
              <Link href="/admin/site-copy" className="font-semibold text-zinc-900 underline-offset-2 hover:underline">
                Site copy
              </Link>
              {" "}for homepage sections, catalog headings, footer text, SEO copy, and legal MDX.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-semibold tabular-nums text-zinc-400">2</span>
            <span>
              <Link href="/admin/products" className="font-semibold text-zinc-900 underline-offset-2 hover:underline">
                Products
              </Link>
              {" "}for names, photos, pricing, publish status, and descriptions.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-0.5 shrink-0 font-semibold tabular-nums text-zinc-400">3</span>
            <span>
              <Link href="/admin/messages" className="font-semibold text-zinc-900 underline-offset-2 hover:underline">
                Messages
              </Link>
              {" "}for customer inquiries submitted through the contact form.
            </span>
          </li>
        </ul>
      </div>
    </main>
  );
}
