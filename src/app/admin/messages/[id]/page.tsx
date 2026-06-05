import Link from "next/link";
import { notFound } from "next/navigation";

import { formatCatalogCentsForAdmin } from "@/lib/admin-pricing";
import { isOrderQuoteTopic, quoteStatusLabel } from "@/lib/order-quote-topics";
import { referenceImagesFromJson } from "@/lib/reference-images";
import { prisma } from "@/lib/prisma";

import { QuoteAdminForm } from "../QuoteAdminForm";

type Props = { params: Promise<{ id: string }> };

export default async function AdminMessageDetailPage({ params }: Props) {
  const { id } = await params;
  const message = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!message) notFound();

  const referenceImages = referenceImagesFromJson(message.referenceImagesJson);
  const isOrderQuote = isOrderQuoteTopic(message.topic);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/admin/messages"
        className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        ← Messages
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{message.topic}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {message.createdAt.toLocaleString()} · {quoteStatusLabel(message.status)}
          </p>
        </div>
        <a
          href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.topic}`)}`}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-50"
        >
          Reply by email
        </a>
      </div>

      <section className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">From</p>
          <p className="mt-1 font-medium text-zinc-900">{message.name}</p>
          <a
            href={`mailto:${encodeURIComponent(message.email)}`}
            className="text-sm text-zinc-600 underline-offset-2 hover:underline"
          >
            {message.email}
          </a>
        </div>

        {isOrderQuote ? (
          <div className="grid gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Garment
              </p>
              <p className="mt-1 text-sm text-zinc-800">{message.garmentType ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Quantity
              </p>
              <p className="mt-1 text-sm text-zinc-800">{message.quantity ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Deadline
              </p>
              <p className="mt-1 text-sm text-zinc-800">{message.deadline ?? "—"}</p>
            </div>
          </div>
        ) : null}

        {referenceImages.length > 0 ? (
          <div className="border-t border-zinc-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Reference images
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {referenceImages.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-t border-zinc-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Message</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">{message.message}</p>
        </div>

        {message.quoteAmountCents != null ? (
          <div className="border-t border-zinc-100 pt-4 text-sm text-zinc-700">
            <p>
              Quoted: <strong>{formatCatalogCentsForAdmin(message.quoteAmountCents)}</strong>
              {message.quoteSentAt
                ? ` · emailed ${message.quoteSentAt.toLocaleString()}`
                : null}
            </p>
            {message.quoteNotes ? (
              <p className="mt-2 whitespace-pre-wrap text-zinc-600">{message.quoteNotes}</p>
            ) : null}
          </div>
        ) : null}
      </section>

      {isOrderQuote ? (
        <QuoteAdminForm
          messageId={message.id}
          quoteNotes={message.quoteNotes}
          quoteAmountCents={message.quoteAmountCents}
          status={message.status}
        />
      ) : null}
    </main>
  );
}
