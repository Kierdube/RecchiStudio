"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return null;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 text-sm font-medium text-zinc-800 sm:gap-4">
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center rounded-md px-2 py-1.5 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex min-h-10 items-center rounded-md px-2 py-1.5 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Products
          </Link>
          <Link
            href="/admin/messages"
            className="inline-flex min-h-10 items-center rounded-md px-2 py-1.5 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Messages
          </Link>
          <Link
            href="/admin/site-copy"
            className="inline-flex min-h-10 items-center rounded-md px-2 py-1.5 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Site copy
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-10 items-center rounded-md px-2 py-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
          >
            View site
          </Link>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="min-h-10 touch-manipulation px-2 text-sm text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
