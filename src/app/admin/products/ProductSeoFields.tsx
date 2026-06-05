export function ProductSeoFields({
  defaultMetaTitle,
  defaultMetaDescription,
}: {
  defaultMetaTitle?: string | null;
  defaultMetaDescription?: string | null;
}) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
      <legend className="px-1 text-sm font-semibold text-zinc-800">SEO (optional)</legend>
      <p className="text-xs text-zinc-500">
        Overrides the default page title and search snippet. Leave blank to use the product name and
        description.
      </p>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="metaTitle">
          Meta title
        </label>
        <input
          id="metaTitle"
          name="metaTitle"
          maxLength={120}
          defaultValue={defaultMetaTitle ?? ""}
          placeholder="Shown in browser tab and search results"
          className="mt-1 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700" htmlFor="metaDescription">
          Meta description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          maxLength={320}
          rows={3}
          defaultValue={defaultMetaDescription ?? ""}
          placeholder="Short summary for search engines (up to ~160 characters recommended)"
          className="mt-1 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2"
        />
      </div>
    </fieldset>
  );
}
