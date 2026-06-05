import Link from "next/link";

import { parseOrderLineItems } from "@/lib/cart";
import { prisma } from "@/lib/prisma";

function formatMoney(cents: number, currency: string): string {
  const code = currency.toUpperCase();
  try {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Orders</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Paid checkouts from Stripe (saved when the webhook fires). You also receive an email if
            Resend is configured.
          </p>
        </div>
        <a
          href="https://dashboard.stripe.com/payments"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          Open Stripe →
        </a>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[40rem] divide-y divide-zinc-200 text-sm sm:min-w-full">
          <thead className="bg-zinc-50 text-left text-xs font-semibold tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No orders yet. Ensure{" "}
                  <code className="rounded bg-zinc-100 px-1 text-xs">STRIPE_WEBHOOK_SECRET</code> is
                  set and Stripe sends events to{" "}
                  <code className="rounded bg-zinc-100 px-1 text-xs">/api/webhooks/stripe</code>.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const lines = parseOrderLineItems(o.lineItemsJson);
                return (
                <tr key={o.id} className="align-top text-zinc-800">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                    {o.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{o.productName}</p>
                    {lines.length > 1 ? (
                      <ul className="mt-2 space-y-1 text-xs text-zinc-600">
                        {lines.map((line, idx) => (
                          <li key={`${o.id}-${idx}`}>
                            {line.productName}
                            {line.size ? ` (${line.size})` : ""} × {line.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : o.size ? (
                      <p className="mt-0.5 text-xs text-zinc-600">Option: {o.size}</p>
                    ) : null}
                    {o.productSlug ? (
                      <Link
                        href={`/products/${o.productSlug}`}
                        className="mt-1 inline-block text-xs text-zinc-600 underline-offset-2 hover:underline"
                      >
                        View product →
                      </Link>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {o.customerName ? (
                      <p className="font-medium text-zinc-900">{o.customerName}</p>
                    ) : null}
                    {o.customerEmail ? (
                      <a
                        href={`mailto:${encodeURIComponent(o.customerEmail)}`}
                        className="text-xs text-zinc-600 underline-offset-2 hover:underline"
                      >
                        {o.customerEmail}
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium tabular-nums">
                    {formatMoney(o.amountCents, o.currency)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs capitalize text-zinc-600">
                    {o.status}
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
