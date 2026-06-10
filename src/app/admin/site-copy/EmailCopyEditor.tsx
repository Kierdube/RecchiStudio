"use client";

import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import {
  EMAIL_ADMIN_SECTIONS,
  emailCopyDefinitionForKey,
  renderEmailOutline,
  type EmailAdminSectionId,
} from "@/lib/email-copy-admin";
import type { SiteCopyPagePayload } from "@/lib/site-copy-admin-structure";

import { SiteCopyBlockForm } from "./SiteCopyBlockForm";

function valuesFromPage(page: SiteCopyPagePayload): Record<string, string> {
  const map: Record<string, string> = {};
  for (const section of page.sections) {
    for (const field of section.fields) {
      map[field.key] = field.value;
    }
  }
  return map;
}

function EmailOutline({ sectionId, values }: { sectionId: EmailAdminSectionId; values: Record<string, string> }) {
  const section = EMAIL_ADMIN_SECTIONS.find((item) => item.id === sectionId);
  const text = useMemo(() => renderEmailOutline(sectionId, values), [sectionId, values]);

  if (!section) return null;

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900">Email layout map</p>
      <p className="mt-1 text-sm text-emerald-900/80">
        This matches the preview. Edit the fields below to change each line. Tokens like{" "}
        <span className="font-mono text-emerald-950">{"{name}"}</span> are filled automatically when the email sends.
      </p>
      <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-emerald-200/80 bg-white p-3 font-mono text-xs leading-relaxed text-zinc-800">
        {text}
      </pre>
      {section.dynamicTokens.length > 0 ? (
        <p className="mt-3 text-xs text-emerald-900/80">
          <span className="font-semibold text-emerald-950">Auto-filled tokens:</span>{" "}
          {section.dynamicTokens.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export function EmailCopyEditor({ page }: { page: SiteCopyPagePayload }) {
  const values = useMemo(() => valuesFromPage(page), [page]);
  const [openSections, setOpenSections] = useState<Set<EmailAdminSectionId>>(
    () => new Set<EmailAdminSectionId>(["contact"]),
  );

  function toggleSection(sectionId: EmailAdminSectionId) {
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

  return (
    <div className="space-y-3">
      {EMAIL_ADMIN_SECTIONS.map((section) => {
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
              <span>
                <span className="block text-base font-semibold text-zinc-900">{section.title}</span>
                <span className="mt-0.5 block text-sm text-zinc-600">{section.description}</span>
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            {isOpen ? (
              <div className="space-y-5 border-t border-zinc-100 px-4 py-4 sm:px-5 sm:py-5">
                <EmailOutline sectionId={section.id} values={values} />

                <div className="space-y-4">
                  {section.fields.map((field) => {
                    const def = emailCopyDefinitionForKey(field.key);
                    if (!def) return null;
                    return (
                      <div key={field.key}>
                        <SiteCopyBlockForm
                          def={{
                            key: def.key,
                            label: field.hint ? `${field.label} — ${field.hint}` : field.label,
                            group: "",
                            format: def.format,
                            defaultValue: def.defaultValue,
                            choices: def.choices,
                          }}
                          value={values[field.key] ?? def.defaultValue}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
