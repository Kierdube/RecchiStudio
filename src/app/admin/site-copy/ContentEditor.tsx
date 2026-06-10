"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import type { SiteCopyPageId, SiteCopyPagePayload } from "@/lib/site-copy-admin-structure";

import { EmailCopyEditor } from "./EmailCopyEditor";
import { EmailPreviewPanel } from "./EmailPreviewPanel";
import { EmailTokenGlossary } from "./EmailTokenGlossary";
import { SiteCopyBlockForm } from "./SiteCopyBlockForm";

export function ContentEditor({ pages }: { pages: SiteCopyPagePayload[] }) {
  const [pageId, setPageId] = useState<SiteCopyPageId>(pages[0]?.id ?? "home");
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const first = pages[0]?.sections[0]?.id;
    return first ? new Set([first]) : new Set();
  });

  const activePage = pages.find((page) => page.id === pageId) ?? pages[0];

  useEffect(() => {
    const page = pages.find((p) => p.id === pageId);
    const firstSection = page?.sections[0]?.id;
    setOpenSections(firstSection ? new Set([firstSection]) : new Set());
  }, [pageId, pages]);

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  if (!activePage) {
    return <p className="text-sm text-zinc-600">No editable content is available yet.</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <label htmlFor="content-page" className="block text-sm font-medium text-zinc-800">
          Page
        </label>
        <select
          id="content-page"
          value={pageId}
          onChange={(e) => setPageId(e.target.value as SiteCopyPageId)}
          className="mt-2 min-h-11 w-full max-w-md cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none ring-zinc-400 focus:ring-2 sm:text-sm"
        >
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      {pageId === "emails" ? (
        <>
          <EmailTokenGlossary />
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 sm:px-5">
            <p className="text-sm text-zinc-700">
              Each email is one editable template. Tokens like{" "}
              <span className="font-mono font-medium text-zinc-900">{"{name}"}</span> are replaced with real
              data when the email sends. Save, then refresh the preview to confirm.
            </p>
            <div className="mt-4">
              <EmailPreviewPanel />
            </div>
          </div>
          <EmailCopyEditor page={activePage} />
        </>
      ) : (
      <div className="space-y-3">
        {activePage.sections.map((section) => {
          const isOpen = openSections.has(section.id);
          return (
            <section
              key={section.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-zinc-50 sm:px-5"
              >
                <span className="text-base font-semibold text-zinc-900">{section.label}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                />
              </button>
              {isOpen ? (
                <div className="space-y-4 border-t border-zinc-100 px-4 py-4 sm:px-5 sm:py-5">
                  {section.fields.map((field) => (
                    <SiteCopyBlockForm
                      key={field.key}
                      def={{
                        key: field.key,
                        label: field.label,
                        group: "",
                        format: field.format,
                        defaultValue: field.value,
                        choices: field.choices,
                      }}
                      value={field.value}
                    />
                  ))}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
      )}
    </div>
  );
}
