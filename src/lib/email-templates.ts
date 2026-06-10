import { applyEmailTemplate, emailCopyGet } from "@/lib/email-copy";
import { siteUrl } from "@/lib/seo";

/** Recchi Studio brand palette (matches storefront). */
const COLORS = {
  forest: "#19371E",
  forestDark: "#142a18",
  mint: "#C5E6A6",
  sage: "#2d5a36",
  cream: "#F4F9EF",
  paper: "#fdfcf8",
  textMuted: "#4a5c4e",
  border: "#19371E1a",
} as const;

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nl2br(text: string): string {
  return escapeHtml(text).replace(/\r?\n/g, "<br />");
}

function emailLayout({
  preheader,
  eyebrow,
  title,
  bodyHtml,
  brandTitle,
  brandTagline,
}: {
  preheader?: string;
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  brandTitle: string;
  brandTagline: string;
}): string {
  const hiddenPreheader = preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>`
    : "";

  const eyebrowHtml = eyebrow
    ? `<p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.sage};">${escapeHtml(eyebrow)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.paper};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  ${hiddenPreheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.paper};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,${COLORS.forest} 0%,${COLORS.forestDark} 100%);border-radius:20px 20px 0 0;">
              <p style="margin:0;font-size:22px;font-weight:600;letter-spacing:-0.02em;color:${COLORS.mint};">${escapeHtml(brandTitle)}</p>
              <p style="margin:6px 0 0;font-size:13px;color:${COLORS.mint};opacity:0.85;">${escapeHtml(brandTagline)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;background-color:#ffffff;border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border};">
              ${eyebrowHtml}
              <h1 style="margin:0 0 20px;font-size:24px;font-weight:600;letter-spacing:-0.02em;line-height:1.25;color:${COLORS.forest};">${escapeHtml(title)}</h1>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;background-color:${COLORS.cream};border:1px solid ${COLORS.border};border-top:none;border-radius:0 0 20px 20px;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.textMuted};">
                <a href="${escapeHtml(siteUrl())}" style="color:${COLORS.sage};font-weight:600;text-decoration:none;">recchistudio.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fieldTable(rows: { label: string; value: string; valueIsHtml?: boolean }[]): string {
  const trs = rows
    .map(
      (row) => `<tr>
        <td style="padding:10px 0 4px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};vertical-align:top;width:120px;">${escapeHtml(row.label)}</td>
        <td style="padding:10px 0 4px;font-size:15px;line-height:1.5;color:${COLORS.forest};vertical-align:top;">${row.valueIsHtml ? row.value : escapeHtml(row.value)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${trs}</table>`;
}

function messageCard(label: string, message: string): string {
  return `<div style="margin:0 0 8px;">
    <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};">${escapeHtml(label)}</p>
    <div style="padding:16px 18px;background-color:${COLORS.cream};border-radius:14px;border:1px solid ${COLORS.border};font-size:15px;line-height:1.65;color:${COLORS.forest};">${nl2br(message)}</div>
  </div>`;
}

function topicBadge(topic: string): string {
  return `<span style="display:inline-block;padding:4px 10px;background-color:${COLORS.cream};border:1px solid ${COLORS.border};border-radius:999px;font-size:12px;font-weight:600;color:${COLORS.sage};">${escapeHtml(topic)}</span>`;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;">
    <tr>
      <td style="border-radius:999px;background-color:${COLORS.forest};">
        <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-size:14px;font-weight:600;color:${COLORS.mint};text-decoration:none;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

function brandFromCopy(copy: Record<string, string>) {
  return {
    brandTitle: emailCopyGet(copy, "email.brand.title", "Recchi Studio"),
    brandTagline: emailCopyGet(
      copy,
      "email.brand.tagline",
      "Nature-inspired patterns & apparel",
    ),
  };
}

export function contactNotificationEmail(
  input: {
    name: string;
    email: string;
    topic: string;
    message: string;
    garmentType?: string;
    quantity?: string;
    deadline?: string;
    referenceImageUrls?: string[];
  },
  copy: Record<string, string> = {},
): { subject: string; text: string; html: string } {
  const orderRows: { label: string; value: string }[] = [];
  if (input.garmentType) orderRows.push({ label: "Garment", value: input.garmentType });
  if (input.quantity) orderRows.push({ label: "Quantity", value: input.quantity });
  if (input.deadline) orderRows.push({ label: "Deadline", value: input.deadline });

  const refImagesText =
    input.referenceImageUrls && input.referenceImageUrls.length > 0
      ? input.referenceImageUrls.map((u) => `- ${u}`).join("\n")
      : "";

  const orderDetailsText =
    orderRows.length > 0
      ? [
          "",
          "Order details:",
          ...orderRows.map((r) => `${r.label}: ${r.value}`),
          refImagesText ? `Reference images:\n${refImagesText}` : null,
        ]
          .filter(Boolean)
          .join("\n")
      : "";

  const subject = applyEmailTemplate(
    emailCopyGet(copy, "email.contact.subject", "Recchi Studio contact ({topic}): {name}"),
    { topic: input.topic, name: input.name },
  );
  const eyebrow = emailCopyGet(copy, "email.contact.eyebrow", "Contact form");
  const title = emailCopyGet(copy, "email.contact.title", "New message");
  const messageLabel = emailCopyGet(copy, "email.contact.message_label", "Message");

  const text = [
    `New contact message — ${input.topic}`,
    "",
    `From: ${input.name} <${input.email}>`,
    `Topic: ${input.topic}`,
    orderDetailsText,
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  const rows = [
    { label: "From", value: `${input.name} <${input.email}>` },
    {
      label: "Topic",
      value: topicBadge(input.topic),
      valueIsHtml: true,
    },
    ...(orderRows.length > 0 ? orderRows : []),
  ];

  let refHtml = "";
  if (input.referenceImageUrls && input.referenceImageUrls.length > 0) {
    const links = input.referenceImageUrls
      .map(
        (url) =>
          `<li style="margin:4px 0;"><a href="${escapeHtml(url)}" style="color:${COLORS.sage};font-size:13px;word-break:break-all;">${escapeHtml(url)}</a></li>`,
      )
      .join("");
    refHtml = `<div style="margin:16px 0 0;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};">Reference images</p>
      <ul style="margin:0;padding-left:18px;color:${COLORS.forest};">${links}</ul>
    </div>`;
  }

  const html = emailLayout({
    preheader: `New ${input.topic} from ${input.name}`,
    eyebrow,
    title,
    bodyHtml: `${fieldTable(rows)}${refHtml}${messageCard(messageLabel, input.message)}`,
    ...brandFromCopy(copy),
  });

  return { subject, text, html };
}

export function orderNotificationEmail(
  input: {
    productName: string;
    lineItems: { productName: string; size: string | null; quantity: number; amountLabel: string }[];
    totalLabel: string;
    customerName: string | null;
    customerEmail: string | null;
    shipping: string;
    stripeSessionId: string;
  },
  copy: Record<string, string> = {},
): { subject: string; text: string; html: string } {
  const itemLines =
    input.lineItems.length > 0
      ? input.lineItems.map((item) => {
          const size = item.size ? `, ${item.size}` : "";
          return `- ${item.productName}${size} × ${item.quantity} — ${item.amountLabel}`;
        })
      : [`- ${input.productName}`];

  const subject = applyEmailTemplate(
    emailCopyGet(copy, "email.order.subject", "New order: {productName}"),
    { productName: input.productName },
  );
  const eyebrow = emailCopyGet(copy, "email.order.eyebrow", "New order");
  const title = emailCopyGet(copy, "email.order.title", "You have a new order");

  const text = [
    "New order — Recchi Studio",
    "",
    "Items:",
    ...itemLines,
    "",
    `Total: ${input.totalLabel}`,
    "",
    `Customer: ${input.customerName ?? "—"}`,
    `Email: ${input.customerEmail ?? "—"}`,
    "",
    "Shipping:",
    input.shipping,
    "",
    `Stripe session: ${input.stripeSessionId}`,
  ].join("\n");

  const itemRows = (
    input.lineItems.length > 0
      ? input.lineItems
      : [{ productName: input.productName, size: null, quantity: 1, amountLabel: input.totalLabel }]
  )
    .map(
      (item) => `<tr>
        <td style="padding:12px 14px;font-size:14px;color:${COLORS.forest};border-bottom:1px solid ${COLORS.border};">${escapeHtml(item.productName)}${item.size ? `<br /><span style="font-size:12px;color:${COLORS.textMuted};">${escapeHtml(item.size)}</span>` : ""}</td>
        <td style="padding:12px 14px;font-size:14px;color:${COLORS.forest};border-bottom:1px solid ${COLORS.border};text-align:center;">${item.quantity}</td>
        <td style="padding:12px 14px;font-size:14px;font-weight:600;color:${COLORS.sage};border-bottom:1px solid ${COLORS.border};text-align:right;white-space:nowrap;">${escapeHtml(item.amountLabel)}</td>
      </tr>`,
    )
    .join("");

  const itemsTable = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${COLORS.border};border-radius:14px;overflow:hidden;">
    <tr style="background-color:${COLORS.cream};">
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:left;color:${COLORS.textMuted};">Item</th>
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:center;color:${COLORS.textMuted};">Qty</th>
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:right;color:${COLORS.textMuted};">Amount</th>
    </tr>
    ${itemRows}
    <tr>
      <td colspan="2" style="padding:14px;font-size:14px;font-weight:600;color:${COLORS.forest};text-align:right;">Total</td>
      <td style="padding:14px;font-size:16px;font-weight:700;color:${COLORS.sage};text-align:right;">${escapeHtml(input.totalLabel)}</td>
    </tr>
  </table>`;

  const html = emailLayout({
    preheader: `New order: ${input.totalLabel}`,
    eyebrow,
    title,
    bodyHtml: `${itemsTable}${fieldTable([
      { label: "Customer", value: input.customerName ?? "—" },
      { label: "Email", value: input.customerEmail ?? "—" },
      { label: "Shipping", value: input.shipping },
    ])}<p style="margin:16px 0 0;font-size:12px;color:${COLORS.textMuted};">Stripe session: <span style="font-family:ui-monospace,monospace;">${escapeHtml(input.stripeSessionId)}</span></p>`,
    ...brandFromCopy(copy),
  });

  return { subject, text, html };
}

export function quoteReadyEmail(
  input: {
    customerName: string;
    topic: string;
    amountLabel: string;
    quoteNotes: string | null;
    contactUrl: string;
  },
  copy: Record<string, string> = {},
): { subject: string; text: string; html: string } {
  const subject = emailCopyGet(copy, "email.quote.subject", "Your Recchi Studio quote is ready");
  const eyebrow = emailCopyGet(copy, "email.quote.eyebrow", "Quote ready");
  const greeting = applyEmailTemplate(
    emailCopyGet(copy, "email.quote.greeting", "Hi {customerName},"),
    { customerName: input.customerName },
  );
  const intro = applyEmailTemplate(
    emailCopyGet(copy, "email.quote.intro", "Your {topic} quote from Recchi Studio is ready."),
    { topic: input.topic.toLowerCase() },
  );
  const totalLabel = emailCopyGet(copy, "email.quote.total_label", "Quoted total");
  const followup = emailCopyGet(
    copy,
    "email.quote.followup",
    "Reply to this email or get in touch if you would like to proceed or have any questions.",
  );
  const ctaLabel = emailCopyGet(copy, "email.quote.cta_label", "Contact us");

  const notesBlock = input.quoteNotes?.trim()
    ? `\n\nDetails:\n${input.quoteNotes.trim()}`
    : "";

  const text = [
    greeting,
    "",
    intro,
    "",
    `${totalLabel}: ${input.amountLabel} CAD`,
    notesBlock,
    "",
    `${followup} ${input.contactUrl}`,
    "",
    "— Recchi Studio",
  ]
    .filter(Boolean)
    .join("\n");

  const notesHtml = input.quoteNotes?.trim()
    ? `<div style="margin:20px 0 0;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};">Details</p>
        <div style="padding:16px 18px;background-color:${COLORS.cream};border-radius:14px;border:1px solid ${COLORS.border};font-size:15px;line-height:1.65;color:${COLORS.forest};">${nl2br(input.quoteNotes.trim())}</div>
      </div>`
    : "";

  const html = emailLayout({
    preheader: `Your quote is ready — ${input.amountLabel} CAD`,
    eyebrow,
    title: greeting,
    bodyHtml: `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${COLORS.textMuted};">${escapeHtml(intro)}</p>
      <div style="margin:20px 0;padding:20px 22px;background:linear-gradient(135deg,${COLORS.cream} 0%,#E8F0DD 100%);border-radius:16px;border:1px solid ${COLORS.border};text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.textMuted};">${escapeHtml(totalLabel)}</p>
        <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:-0.02em;color:${COLORS.sage};">${escapeHtml(input.amountLabel)} <span style="font-size:16px;font-weight:600;">CAD</span></p>
      </div>
      ${notesHtml}
      <p style="margin:20px 0 0;font-size:15px;line-height:1.65;color:${COLORS.textMuted};">${escapeHtml(followup)}</p>
      ${ctaButton(input.contactUrl, ctaLabel)}`,
    ...brandFromCopy(copy),
  });

  return { subject, text, html };
}
