import { EMAIL_COPY_DEFINITIONS } from "@/lib/email-copy-definitions";
import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";

export type EmailAdminSectionId = "contact" | "order" | "quote";

export type EmailTokenHelp = {
  token: string;
  description: string;
};

export type EmailAdminSection = {
  id: EmailAdminSectionId;
  title: string;
  description: string;
  templateKey: string;
  tokenHelp: EmailTokenHelp[];
};

const DEF_BY_KEY = new Map(EMAIL_COPY_DEFINITIONS.map((def) => [def.key, def]));

export const EMAIL_ADMIN_SECTIONS: EmailAdminSection[] = [
  {
    id: "contact",
    title: "Contact form alert",
    description: "Sent to your inbox when someone submits the contact form.",
    templateKey: "email.contact.template",
    tokenHelp: [
      { token: "{name}", description: "Customer's name from the form" },
      { token: "{email}", description: "Customer's email address" },
      { token: "{topic}", description: "Topic they selected (e.g. Custom Order Request)" },
      { token: "{message}", description: "The message they wrote" },
      { token: "{garmentType}", description: "Garment type — custom/bulk orders only" },
      { token: "{quantity}", description: "Quantity requested — custom/bulk orders only" },
      { token: "{deadline}", description: "Deadline or event date — custom/bulk orders only" },
      {
        token: "{referenceImages}",
        description:
          "Links to photos the customer uploaded as inspiration on the contact form (custom/bulk orders). Each image appears as a clickable URL in the email.",
      },
    ],
  },
  {
    id: "order",
    title: "New order alert",
    description: "Sent to your inbox when a customer completes checkout.",
    templateKey: "email.order.template",
    tokenHelp: [
      { token: "{productName}", description: "First product name in the order" },
      { token: "{lineItems}", description: "Order line items table (auto-generated)" },
      { token: "{orderTotal}", description: "Order total amount" },
      { token: "{customerName}", description: "Customer name from Stripe checkout" },
      { token: "{customerEmail}", description: "Customer email from Stripe checkout" },
      { token: "{shippingAddress}", description: "Formatted shipping address" },
      { token: "{stripeSessionId}", description: "Stripe checkout session ID" },
    ],
  },
  {
    id: "quote",
    title: "Quote ready email",
    description: "Sent to the customer when you send a quote from Messages.",
    templateKey: "email.quote.template",
    tokenHelp: [
      { token: "{customerName}", description: "Customer name from the message thread" },
      { token: "{topic}", description: "Original inquiry topic (e.g. custom order request)" },
      { token: "{quoteAmount}", description: "Quoted price you entered in admin" },
      { token: "{quoteNotes}", description: "Quote details/notes you entered in admin" },
    ],
  },
];

export type EmailGlossaryEntry = {
  token: string;
  description: string;
  usedIn: string[];
};

export type EmailTemplateTip = {
  label: string;
  description: string;
};

/** Collapsible glossary on the Emails content page. */
export const EMAIL_TEMPLATE_TIPS: EmailTemplateTip[] = [
  {
    label: "Subject:",
    description: "First line must start with Subject: — the rest is the email subject (tokens allowed).",
  },
  {
    label: "[Button label]",
    description: "Quote email only. A line in square brackets becomes the CTA button (e.g. [Contact us]).",
  },
  {
    label: "Item | Qty | Amount",
    description:
      "Order email only. The line before {lineItems} sets the table column headers (separate with |).",
  },
];

export function buildEmailTokenGlossary(): EmailGlossaryEntry[] {
  const map = new Map<string, { descriptions: string[]; usedIn: Set<string> }>();

  for (const section of EMAIL_ADMIN_SECTIONS) {
    for (const item of section.tokenHelp) {
      const existing = map.get(item.token);
      if (existing) {
        existing.descriptions.push(item.description);
        existing.usedIn.add(section.title);
      } else {
        map.set(item.token, {
          descriptions: [item.description],
          usedIn: new Set([section.title]),
        });
      }
    }
  }

  return Array.from(map.entries())
    .map(([token, { descriptions, usedIn }]) => ({
      token,
      description: [...new Set(descriptions)].join(" "),
      usedIn: [...usedIn],
    }))
    .sort((a, b) => a.token.localeCompare(b.token));
}

export function emailCopyDefinitionForKey(key: string): SiteCopyDefinition | undefined {
  return DEF_BY_KEY.get(key);
}
