import Link from "next/link";

import { buildSiteCopyAdminPages } from "@/lib/site-copy-admin-structure";
import { getSiteCopyRecord } from "@/lib/site-copy";

import { ContentEditor } from "./ContentEditor";

export const metadata = {
  title: "Content",
};

export default async function AdminSiteCopyPage() {
  const map = await getSiteCopyRecord();
  const pages = buildSiteCopyAdminPages(map);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/admin" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
        ← Dashboard
      </Link>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">Content</h1>
      <p className="mt-1.5 max-w-xl text-sm text-zinc-600">
        Choose a page, open a section, edit the text, and click <span className="font-medium text-zinc-800">Save</span>
        . Use the toolbar for bold, italic, underline, links, and fonts. Open{" "}
        <span className="font-medium text-zinc-800">Global styles</span> for site-wide heading and paragraph styling.
      </p>

      <ContentEditor pages={pages} />
    </main>
  );
}
