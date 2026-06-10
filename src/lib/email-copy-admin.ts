import { EMAIL_COPY_DEFINITIONS } from "@/lib/email-copy-definitions";
import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";

export type EmailAdminSectionId = "shared" | "contact" | "order" | "quote";

export type EmailAdminField = {
  key: string;
  label: string;
  hint?: string;
};

export type EmailAdminSection = {
  id: EmailAdminSectionId;
  title: string;
  description: string;
  outline: string;
  dynamicTokens: string[];
  fields: EmailAdminField[];
};

const DEF_BY_KEY = new Map(EMAIL_COPY_DEFINITIONS.map((def) => [def.key, def]));

function field(key: string, hint?: string): EmailAdminField {
  const def = DEF_BY_KEY.get(key);
  return { key, label: def?.label ?? key, hint };
}

/** Visual map of each email — matches the preview layout. */
export const EMAIL_ADMIN_SECTIONS: EmailAdminSection[] = [
  {
    id: "shared",
    title: "Shared header",
    description: "Appears at the top of every email.",
    outline: `{brandTitle}
{brandTagline}`,
    dynamicTokens: [],
    fields: [field("email.brand.title"), field("email.brand.tagline")],
  },
  {
    id: "contact",
    title: "Contact form alert",
    description: "Sent to your inbox when someone submits the contact form.",
    outline: `Subject: {subject}

{brandTitle}
{brandTagline}

{eyebrow}
{title}

{fromLabel}: {name} <{email}>
{topicLabel}: {topic}
{garmentLabel}: {garmentType}
{quantityLabel}: {quantity}
{deadlineLabel}: {deadline}

{referenceImagesLabel}:
{referenceImages}

{messageLabel}
{message}`,
    dynamicTokens: [
      "{name}",
      "{email}",
      "{topic}",
      "{message}",
      "{garmentType}",
      "{quantity}",
      "{deadline}",
      "{referenceImages}",
    ],
    fields: [
      field("email.contact.subject", "Use {topic} and {name}"),
      field("email.contact.eyebrow"),
      field("email.contact.title"),
      field("email.contact.from_label"),
      field("email.contact.topic_label"),
      field("email.contact.garment_label", "Custom/bulk orders only"),
      field("email.contact.quantity_label", "Custom/bulk orders only"),
      field("email.contact.deadline_label", "Custom/bulk orders only"),
      field("email.contact.reference_images_label"),
      field("email.contact.message_label"),
    ],
  },
  {
    id: "order",
    title: "New order alert",
    description: "Sent to your inbox when a customer completes checkout.",
    outline: `Subject: {subject}

{brandTitle}
{brandTagline}

{eyebrow}
{title}

{itemLabel}    {qtyLabel}    {amountLabel}
{lineItems}

{totalLabel}: {orderTotal}

{customerLabel}: {customerName}
{emailLabel}: {customerEmail}
{shippingLabel}:
{shippingAddress}

{stripeLabel}: {stripeSessionId}`,
    dynamicTokens: [
      "{productName}",
      "{lineItems}",
      "{orderTotal}",
      "{customerName}",
      "{customerEmail}",
      "{shippingAddress}",
      "{stripeSessionId}",
    ],
    fields: [
      field("email.order.subject", "Use {productName}"),
      field("email.order.eyebrow"),
      field("email.order.title"),
      field("email.order.item_label"),
      field("email.order.qty_label"),
      field("email.order.amount_label"),
      field("email.order.total_label"),
      field("email.order.customer_label"),
      field("email.order.email_label"),
      field("email.order.shipping_label"),
      field("email.order.stripe_label"),
    ],
  },
  {
    id: "quote",
    title: "Quote ready email",
    description: "Sent to the customer when you send a quote from Messages.",
    outline: `Subject: {subject}

{brandTitle}
{brandTagline}

{eyebrow}
{greeting}

{intro}

{totalLabel}
{quoteAmount} CAD

{detailsLabel}
{quoteNotes}

{followup}

[{ctaLabel}]`,
    dynamicTokens: ["{customerName}", "{topic}", "{quoteAmount}", "{quoteNotes}"],
    fields: [
      field("email.quote.subject"),
      field("email.quote.eyebrow"),
      field("email.quote.greeting", "Use {customerName}"),
      field("email.quote.intro", "Use {topic}"),
      field("email.quote.total_label"),
      field("email.quote.details_label"),
      field("email.quote.followup"),
      field("email.quote.cta_label"),
    ],
  },
];

export function emailCopyDefinitionForKey(key: string): SiteCopyDefinition | undefined {
  return DEF_BY_KEY.get(key);
}

/** Fill outline placeholders with saved copy so the map matches the preview. */
export function renderEmailOutline(sectionId: EmailAdminSectionId, values: Record<string, string>): string {
  const section = EMAIL_ADMIN_SECTIONS.find((s) => s.id === sectionId);
  if (!section) return "";

  const v = (key: string, fallback: string) => values[key]?.trim() || fallback;

  const replacements: Record<string, string> = {
    subject:
      sectionId === "contact"
        ? v("email.contact.subject", "Recchi Studio contact ({topic}): {name}")
        : sectionId === "order"
          ? v("email.order.subject", "New order: {productName}")
          : sectionId === "quote"
            ? v("email.quote.subject", "Your Recchi Studio quote is ready")
            : "",
    brandTitle: v("email.brand.title", "Recchi Studio"),
    brandTagline: v("email.brand.tagline", "Nature-inspired patterns & apparel"),
    eyebrow:
      sectionId === "shared"
        ? ""
        : v(`email.${sectionId}.eyebrow`, ""),
    title: sectionId === "contact" ? v("email.contact.title", "New message") : v("email.order.title", "You have a new order"),
    fromLabel: v("email.contact.from_label", "From"),
    topicLabel: v("email.contact.topic_label", "Topic"),
    garmentLabel: v("email.contact.garment_label", "Garment"),
    quantityLabel: v("email.contact.quantity_label", "Quantity"),
    deadlineLabel: v("email.contact.deadline_label", "Deadline"),
    referenceImagesLabel: v("email.contact.reference_images_label", "Reference images"),
    messageLabel: v("email.contact.message_label", "Message"),
    itemLabel: v("email.order.item_label", "Item"),
    qtyLabel: v("email.order.qty_label", "Qty"),
    amountLabel: v("email.order.amount_label", "Amount"),
    totalLabel:
      sectionId === "order"
        ? v("email.order.total_label", "Total")
        : v("email.quote.total_label", "Quoted total"),
    customerLabel: v("email.order.customer_label", "Customer"),
    emailLabel: v("email.order.email_label", "Email"),
    shippingLabel: v("email.order.shipping_label", "Shipping"),
    stripeLabel: v("email.order.stripe_label", "Stripe session"),
    greeting: v("email.quote.greeting", "Hi {customerName},"),
    intro: v("email.quote.intro", "Your {topic} quote from Recchi Studio is ready."),
    detailsLabel: v("email.quote.details_label", "Details"),
    followup: v(
      "email.quote.followup",
      "Reply to this email or get in touch if you would like to proceed or have any questions.",
    ),
    ctaLabel: v("email.quote.cta_label", "Contact us"),
  };

  let text = section.outline;
  for (const [token, value] of Object.entries(replacements)) {
    text = text.replaceAll(`{${token}}`, value);
  }
  return text;
}
