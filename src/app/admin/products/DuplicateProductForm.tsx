import { duplicateProduct } from "./actions";

export function DuplicateProductForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={duplicateProduct}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex min-h-9 items-center justify-center rounded-md border border-zinc-300 px-2 py-1.5 text-xs font-medium touch-manipulation hover:bg-zinc-50"
      >
        Duplicate
      </button>
    </form>
  );
}
