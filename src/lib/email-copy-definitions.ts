import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";

/** Editable transactional email copy (admin → Content → Emails). */
export const EMAIL_COPY_DEFINITIONS: SiteCopyDefinition[] = [
  {
    group: "Emails — shared header",
    key: "email.brand.title",
    label: "Header brand name",
    format: "plain",
    defaultValue: "Recchi Studio",
  },
  {
    group: "Emails — shared header",
    key: "email.brand.tagline",
    label: "Header tagline",
    format: "plain",
    defaultValue: "Nature-inspired patterns & apparel",
  },

  {
    group: "Emails — contact alert (to you)",
    key: "email.contact.subject",
    label: "Subject line — use {topic} and {name}",
    format: "plain",
    defaultValue: "Recchi Studio contact ({topic}): {name}",
  },
  {
    group: "Emails — contact alert (to you)",
    key: "email.contact.eyebrow",
    label: "Eyebrow label",
    format: "plain",
    defaultValue: "Contact form",
  },
  {
    group: "Emails — contact alert (to you)",
    key: "email.contact.title",
    label: "Email headline",
    format: "plain",
    defaultValue: "New message",
  },
  {
    group: "Emails — contact alert (to you)",
    key: "email.contact.message_label",
    label: "Customer message section label",
    format: "plain",
    defaultValue: "Message",
  },

  {
    group: "Emails — new order (to you)",
    key: "email.order.subject",
    label: "Subject line — use {productName}",
    format: "plain",
    defaultValue: "New order: {productName}",
  },
  {
    group: "Emails — new order (to you)",
    key: "email.order.eyebrow",
    label: "Eyebrow label",
    format: "plain",
    defaultValue: "New order",
  },
  {
    group: "Emails — new order (to you)",
    key: "email.order.title",
    label: "Email headline",
    format: "plain",
    defaultValue: "You have a new order",
  },

  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.subject",
    label: "Subject line",
    format: "plain",
    defaultValue: "Your Recchi Studio quote is ready",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.eyebrow",
    label: "Eyebrow label",
    format: "plain",
    defaultValue: "Quote ready",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.greeting",
    label: "Greeting — use {customerName}",
    format: "plain",
    defaultValue: "Hi {customerName},",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.intro",
    label: "Intro paragraph — use {topic}",
    format: "plain",
    defaultValue: "Your {topic} quote from Recchi Studio is ready.",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.total_label",
    label: "Quote total label",
    format: "plain",
    defaultValue: "Quoted total",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.followup",
    label: "Text after quote details",
    format: "plain",
    defaultValue:
      "Reply to this email or get in touch if you would like to proceed or have any questions.",
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.cta_label",
    label: "Button label",
    format: "plain",
    defaultValue: "Contact us",
  },
];
