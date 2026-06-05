import Link from "next/link";

import { isOrderQuoteTopic, quoteStatusLabel } from "@/lib/order-quote-topics";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Contact messages</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Submissions from the public contact form. Custom and bulk order requests include structured
            fields and a quote workflow.
          </p>
        </div>
        <Link
          href="/contact"
          className="text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          View contact page →
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
        <table className="min-w-[40rem] divide-y divide-zinc-200 text-sm sm:min-w-full">
          <thead className="bg-zinc-50 text-left text-xs font-semibold tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Preview</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr key={m.id} className="align-top text-zinc-800">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-500">
                    {m.createdAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-zinc-900">{m.name}</p>
                    <p className="text-xs text-zinc-600">{m.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {m.topic}
                    {isOrderQuoteTopic(m.topic) && m.garmentType ? (
                      <p className="mt-1 text-xs text-zinc-500">{m.garmentType}</p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs">
                    {isOrderQuoteTopic(m.topic) ? (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700">
                        {quoteStatusLabel(m.status)}
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-2 text-zinc-600">{m.message}</p>
                    <Link
                      href={`/admin/messages/${m.id}`}
                      className="mt-2 inline-block text-xs font-medium text-zinc-900 underline-offset-2 hover:underline"
                    >
                      View details →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
