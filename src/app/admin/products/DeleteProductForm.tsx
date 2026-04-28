"use client";

import { deleteProduct } from "./actions";

export function DeleteProductForm({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteProduct}
      onSubmit={(e) => {
        if (!confirm(`Delete “${name}”? This cannot be undone.`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-700 touch-manipulation hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
