"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  EMAIL_ADMIN_SECTIONS,
  emailCopyDefinitionForKey,
} from "@/lib/email-copy-admin";
import type { SiteCopyPagePayload } from "@/lib/site-copy-admin-structure";

import { SiteCopyBlockForm } from "./SiteCopyBlockForm";

function valueForKey(page: SiteCopyPagePayload, key: string, fallback: string): string {
  for (const section of page.sections) {
    const field = section.fields.find((item) => item.key === key);
    if (field) return field.value;
  }
  return fallback;
}

export function EmailCopyEditor({ page }: { page: SiteCopyPagePayload }) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(["contact"]),
  );

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

  return (
    <div className="space-y-3">
      {EMAIL_ADMIN_SECTIONS.map((section) => {
        const def = emailCopyDefinitionForKey(section.templateKey);
        if (!def) return null;

        const isOpen = openSections.has(section.id);
        const value = valueForKey(page, section.templateKey, def.defaultValue);

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
              <div className="space-y-4 border-t border-zinc-100 px-4 py-4 sm:px-5 sm:py-5">
                <p className="text-sm text-zinc-600">
                  Edit the full email below. See the{" "}
                  <span className="font-medium text-zinc-800">Token glossary</span> above for what each{" "}
                  <span className="font-mono text-zinc-900">{"{token}"}</span> means.
                </p>

                <SiteCopyBlockForm
                  def={{
                    key: def.key,
                    label: "Email template",
                    group: "",
                    format: "plain",
                    defaultValue: def.defaultValue,
                  }}
                  value={value}
                  textareaRows={22}
                />
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
