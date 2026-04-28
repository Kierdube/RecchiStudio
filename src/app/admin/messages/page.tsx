import Link from "next/link";

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
            Submissions from the public contact form (also emailed if Resend is configured).
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
        <table className="min-w-[32rem] divide-y divide-zinc-200 text-sm sm:min-w-full">
          <thead className="bg-zinc-50 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-zinc-500">
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
                    <a
                      href={`mailto:${encodeURIComponent(m.email)}`}
                      className="text-xs text-zinc-600 underline-offset-2 hover:underline"
                    >
                      {m.email}
                    </a>
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <p className="whitespace-pre-wrap break-words text-zinc-700">{m.message}</p>
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
