import Link from "next/link";

import { SITE_COPY_DEFINITIONS, siteCopyGroupsInOrder } from "@/lib/site-copy-definitions";
import { getSiteCopyRecord } from "@/lib/site-copy";

import { SiteCopyBlockForm } from "./SiteCopyBlockForm";

export const metadata = {
  title: "Site copy",
};

export default async function AdminSiteCopyPage() {
  const map = await getSiteCopyRecord();
  const groups = siteCopyGroupsInOrder();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Site copy</h1>
      <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
        Public wording grouped below. Each field has its own <span className="font-medium text-zinc-800">Save</span>
        — changes go live right after a successful save.
      </p>

      <div className="mt-5 rounded-lg border border-zinc-200/80 bg-zinc-50/80 px-4 py-3 text-xs leading-relaxed text-zinc-500">
        <span className="font-medium text-zinc-600">Tip:</span>{" "}
        <code className="rounded bg-white px-1 py-0.5 font-mono text-[11px] text-zinc-700">npm run db:seed</code> adds
        new keys and refreshes labels; it does not wipe text you already saved.
      </div>

      <div className="mt-10 space-y-12">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900">
              {group}
            </h2>
            <div className="mt-6 space-y-6">
              {SITE_COPY_DEFINITIONS.filter((d) => d.group === group).map((def) => (
                <SiteCopyBlockForm key={def.key} def={def} value={map[def.key] ?? def.defaultValue} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
