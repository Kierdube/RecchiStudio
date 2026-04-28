import Link from "next/link";

import { NewProductForm } from "../NewProductForm";

export default function NewProductPage() {
  return (
    <main className="px-4 py-10 sm:px-6">
      <Link href="/admin/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
        ← Products
      </Link>
      <h1 className="mt-6 text-2xl font-semibold">New product</h1>
      <div className="mt-8">
        <NewProductForm />
      </div>
    </main>
  );
}
