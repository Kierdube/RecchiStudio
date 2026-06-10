import {
  SITE_COPY_DEFINITIONS,
  type SiteCopyDefinition,
  type SiteCopyFormat,
} from "@/lib/site-copy-definitions";

export type SiteCopyPageId =
  | "styles"
  | "emails"
  | "home"
  | "catalog"
  | "about"
  | "contact"
  | "shipping"
  | "policies"
  | "header"
  | "footer";

export type SiteCopyFieldPayload = {
  key: string;
  label: string;
  format: SiteCopyFormat;
  value: string;
  choices?: { value: string; label: string }[];
};

export type SiteCopySectionPayload = {
  id: string;
  label: string;
  fields: SiteCopyFieldPayload[];
};

export type SiteCopyPagePayload = {
  id: SiteCopyPageId;
  label: string;
  sections: SiteCopySectionPayload[];
};

const PAGE_META: { id: SiteCopyPageId; label: string }[] = [
  { id: "styles", label: "Global styles" },
  { id: "emails", label: "Emails" },
  { id: "home", label: "Home" },
  { id: "catalog", label: "Catalog" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "shipping", label: "Shipping & returns" },
  { id: "policies", label: "Store policies" },
  { id: "header", label: "Header & menu" },
  { id: "footer", label: "Footer" },
];

const SECTION_LABELS: Record<string, string> = {
  "Home — hero": "Hero banner",
  "Home — collection": "Featured collection",
  "Home — banner": "Image banner",
  "Home — story": "Our story",
  "Home — feature cards": "Feature cards",
  "Home — closing": "Closing message",
  Catalog: "Page content",
  "About page": "Introduction",
  "About — story": "Story section",
  "About — highlights": "Highlights",
  "Contact page": "Page content",
  "Legal — policies page": "Page settings",
  "Legal — shipping page": "Page settings",
  "Site header": "Navigation & menu",
  Footer: "Footer content",
  "Emails — contact alert (to you)": "Contact form alert",
  "Emails — new order (to you)": "New order alert",
  "Emails — quote ready (to customer)": "Quote ready email",
};

function pageIdForDefinition(def: SiteCopyDefinition): SiteCopyPageId {
  if (def.key.startsWith("global.type.")) return "styles";
  if (def.key.startsWith("email.")) return "emails";
  if (def.key === "legal.policies_mdx" || def.key.startsWith("policies.")) return "policies";
  if (def.key === "legal.shipping_mdx" || def.key.startsWith("shipping.")) return "shipping";
  if (def.key.startsWith("home.")) return "home";
  if (def.key.startsWith("catalog.")) return "catalog";
  if (def.key.startsWith("about.")) return "about";
  if (def.key.startsWith("contact.")) return "contact";
  if (def.key.startsWith("header.")) return "header";
  if (def.key.startsWith("footer.")) return "footer";
  return "home";
}

function sectionIdForDefinition(def: SiteCopyDefinition): string {
  if (def.key === "legal.policies_mdx") return "policies-body";
  if (def.key === "legal.shipping_mdx") return "shipping-body";
  return def.group;
}

function sectionLabelForDefinition(def: SiteCopyDefinition): string {
  if (def.key === "legal.policies_mdx" || def.key === "legal.shipping_mdx") {
    return "Page content";
  }
  if (def.group.startsWith("Global styles — ")) {
    return def.group.replace("Global styles — ", "");
  }
  return SECTION_LABELS[def.group] ?? def.group;
}

/** Serializable tree for the Content admin UI. */
export function buildSiteCopyAdminPages(values: Record<string, string>): SiteCopyPagePayload[] {
  const pageSections = new Map<
    SiteCopyPageId,
    Map<string, { label: string; fields: SiteCopyFieldPayload[] }>
  >();

  for (const def of SITE_COPY_DEFINITIONS) {
    const pageId = pageIdForDefinition(def);
    const sectionId = sectionIdForDefinition(def);
    const sectionLabel = sectionLabelForDefinition(def);

    if (!pageSections.has(pageId)) {
      pageSections.set(pageId, new Map());
    }
    const sections = pageSections.get(pageId)!;
    if (!sections.has(sectionId)) {
      sections.set(sectionId, { label: sectionLabel, fields: [] });
    }

    sections.get(sectionId)!.fields.push({
      key: def.key,
      label: def.label,
      format: def.format,
      value: values[def.key] ?? def.defaultValue,
      choices: def.choices,
    });
  }

  return PAGE_META.map((page) => {
    const sections = pageSections.get(page.id);
    if (!sections || sections.size === 0) {
      return { ...page, sections: [] };
    }

    const orderedSectionIds: string[] = [];
    for (const def of SITE_COPY_DEFINITIONS) {
      if (pageIdForDefinition(def) !== page.id) continue;
      const sectionId = sectionIdForDefinition(def);
      if (!orderedSectionIds.includes(sectionId)) {
        orderedSectionIds.push(sectionId);
      }
    }

    return {
      id: page.id,
      label: page.label,
      sections: orderedSectionIds.map((id) => {
        const section = sections.get(id)!;
        return { id, label: section.label, fields: section.fields };
      }),
    };
  }).filter((page) => page.sections.length > 0);
}
