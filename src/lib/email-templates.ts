import { applyEmailTemplate, emailCopyGet } from "@/lib/email-copy";
import {
  EMAIL_CONTACT_TEMPLATE_DEFAULT,
  EMAIL_ORDER_TEMPLATE_DEFAULT,
  EMAIL_QUOTE_TEMPLATE_DEFAULT,
} from "@/lib/email-template-defaults";
import {
  parseEmailTemplate,
  renderTemplatePlainText,
  substituteTemplateValue,
  type TemplateBodyLine,
} from "@/lib/email-template-parser";
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
  if (rows.length === 0) return "";
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

function getTemplate(copy: Record<string, string>, key: string, fallback: string): string {
  return emailCopyGet(copy, key, fallback);
}

function rowValueVisible(value: string): boolean {
  return value.trim().length > 0 && !/^\{[a-zA-Z]+\}$/.test(value.trim());
}

function renderContactBodyHtml(
  body: TemplateBodyLine[],
  vars: Record<string, string>,
  input: { topic: string; message: string; referenceImageUrls?: string[] },
): string {
  const tableRows: { label: string; value: string; valueIsHtml?: boolean }[] = [];
  let html = "";

  for (const line of body) {
    if (line.type === "row") {
      const value = substituteTemplateValue(line.valueTemplate, vars);
      if (!rowValueVisible(value)) continue;
      if (line.label.toLowerCase() === "topic") {
        tableRows.push({ label: line.label, value: topicBadge(input.topic), valueIsHtml: true });
      } else {
        tableRows.push({ label: line.label, value });
      }
      continue;
    }

    if (line.type === "block") {
      if (line.token === "referenceImages") {
        if (input.referenceImageUrls && input.referenceImageUrls.length > 0) {
          const links = input.referenceImageUrls
            .map(
              (url) =>
                `<li style="margin:4px 0;"><a href="${escapeHtml(url)}" style="color:${COLORS.sage};font-size:13px;word-break:break-all;">${escapeHtml(url)}</a></li>`,
            )
            .join("");
          html += `<div style="margin:16px 0 0;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};">${escapeHtml(line.label)}</p>
            <ul style="margin:0;padding-left:18px;color:${COLORS.forest};">${links}</ul>
          </div>`;
        }
        continue;
      }
      if (line.token === "message") {
        html += messageCard(line.label, input.message);
      }
      continue;
    }

    if (line.type === "text") {
      const content = substituteTemplateValue(line.content, vars);
      if (content.trim()) {
        html += `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${COLORS.textMuted};">${escapeHtml(content)}</p>`;
      }
    }
  }

  return `${fieldTable(tableRows)}${html}`;
}

function renderOrderItemsTable(
  lineItems: { productName: string; size: string | null; quantity: number; amountLabel: string }[],
  totalLabel: string,
  headers: [string, string, string],
  totalRowLabel: string,
): string {
  const itemRows = lineItems
    .map(
      (item) => `<tr>
        <td style="padding:12px 14px;font-size:14px;color:${COLORS.forest};border-bottom:1px solid ${COLORS.border};">${escapeHtml(item.productName)}${item.size ? `<br /><span style="font-size:12px;color:${COLORS.textMuted};">${escapeHtml(item.size)}</span>` : ""}</td>
        <td style="padding:12px 14px;font-size:14px;color:${COLORS.forest};border-bottom:1px solid ${COLORS.border};text-align:center;">${item.quantity}</td>
        <td style="padding:12px 14px;font-size:14px;font-weight:600;color:${COLORS.sage};border-bottom:1px solid ${COLORS.border};text-align:right;white-space:nowrap;">${escapeHtml(item.amountLabel)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid ${COLORS.border};border-radius:14px;overflow:hidden;">
    <tr style="background-color:${COLORS.cream};">
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:left;color:${COLORS.textMuted};">${escapeHtml(headers[0])}</th>
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:center;color:${COLORS.textMuted};">${escapeHtml(headers[1])}</th>
      <th style="padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-align:right;color:${COLORS.textMuted};">${escapeHtml(headers[2])}</th>
    </tr>
    ${itemRows}
    <tr>
      <td colspan="2" style="padding:14px;font-size:14px;font-weight:600;color:${COLORS.forest};text-align:right;">${escapeHtml(totalRowLabel)}</td>
      <td style="padding:14px;font-size:16px;font-weight:700;color:${COLORS.sage};text-align:right;">${escapeHtml(totalLabel)}</td>
    </tr>
  </table>`;
}

function renderOrderBodyHtml(
  body: TemplateBodyLine[],
  vars: Record<string, string>,
  input: {
    lineItems: { productName: string; size: string | null; quantity: number; amountLabel: string }[];
    totalLabel: string;
    shipping: string;
    stripeSessionId: string;
    customerName: string | null;
    customerEmail: string | null;
  },
): string {
  let html = "";
  const tableRows: { label: string; value: string }[] = [];

  for (const line of body) {
    if (line.type === "embed" && line.token === "lineItems") {
      const headers = line.tableHeaders ?? ["Item", "Qty", "Amount"];
      const totalRow = body.find(
        (item): item is Extract<TemplateBodyLine, { type: "row" }> =>
          item.type === "row" && item.valueTemplate.includes("{orderTotal}"),
      );
      const totalRowLabel = totalRow?.label ?? "Total";
      html += renderOrderItemsTable(input.lineItems, input.totalLabel, headers, totalRowLabel);
      continue;
    }

    if (line.type === "row") {
      const value = substituteTemplateValue(line.valueTemplate, {
        ...vars,
        shippingAddress: input.shipping,
        stripeSessionId: input.stripeSessionId,
        customerName: input.customerName ?? "—",
        customerEmail: input.customerEmail ?? "—",
      });
      if (!rowValueVisible(value)) continue;
      if (line.label.toLowerCase() === "shipping") {
        tableRows.push({ label: line.label, value: input.shipping });
      } else if (line.valueTemplate.includes("{stripeSessionId}")) {
        html += `<p style="margin:16px 0 0;font-size:12px;color:${COLORS.textMuted};">${escapeHtml(line.label)}: <span style="font-family:ui-monospace,monospace;">${escapeHtml(input.stripeSessionId)}</span></p>`;
      } else {
        tableRows.push({ label: line.label, value });
      }
      continue;
    }

    if (line.type === "block" && line.token === "shippingAddress") {
      tableRows.push({ label: line.label, value: input.shipping });
    }
  }

  return `${html}${fieldTable(tableRows)}`;
}

function renderQuoteBodyHtml(
  body: TemplateBodyLine[],
  vars: Record<string, string>,
  input: { amountLabel: string; quoteNotes: string | null; contactUrl: string },
): string {
  let html = "";

  for (const line of body) {
    if (line.type === "text") {
      const content = substituteTemplateValue(line.content, vars);
      if (content.trim()) {
        html += `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:${COLORS.textMuted};">${escapeHtml(content)}</p>`;
      }
      continue;
    }

    if (line.type === "block" && line.token === "quoteAmount") {
      html += `<div style="margin:20px 0;padding:20px 22px;background:linear-gradient(135deg,${COLORS.cream} 0%,#E8F0DD 100%);border-radius:16px;border:1px solid ${COLORS.border};text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.textMuted};">${escapeHtml(line.label)}</p>
        <p style="margin:0;font-size:32px;font-weight:700;letter-spacing:-0.02em;color:${COLORS.sage};">${escapeHtml(input.amountLabel)} <span style="font-size:16px;font-weight:600;">${escapeHtml(line.suffix ?? "CAD")}</span></p>
      </div>`;
      continue;
    }

    if (line.type === "block" && line.token === "quoteNotes" && input.quoteNotes?.trim()) {
      html += `<div style="margin:20px 0 0;">
        <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.textMuted};">${escapeHtml(line.label)}</p>
        <div style="padding:16px 18px;background-color:${COLORS.cream};border-radius:14px;border:1px solid ${COLORS.border};font-size:15px;line-height:1.65;color:${COLORS.forest};">${nl2br(input.quoteNotes.trim())}</div>
      </div>`;
      continue;
    }

    if (line.type === "cta") {
      html += ctaButton(input.contactUrl, line.label);
    }
  }

  return html;
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
  const template = getTemplate(copy, "email.contact.template", EMAIL_CONTACT_TEMPLATE_DEFAULT);
  const parsed = parseEmailTemplate(template);

  const referenceImages =
    input.referenceImageUrls && input.referenceImageUrls.length > 0
      ? input.referenceImageUrls.map((url) => `- ${url}`).join("\n")
      : "";

  const vars = {
    name: input.name,
    email: input.email,
    topic: input.topic,
    message: input.message,
    garmentType: input.garmentType ?? "",
    quantity: input.quantity ?? "",
    deadline: input.deadline ?? "",
    referenceImages,
  };

  const subject = applyEmailTemplate(parsed.subject, vars);
  const headline = applyEmailTemplate(parsed.headline, vars);
  const text = renderTemplatePlainText(template, vars);
  const html = emailLayout({
    preheader: `New ${input.topic} from ${input.name}`,
    eyebrow: parsed.eyebrow,
    title: headline,
    bodyHtml: renderContactBodyHtml(parsed.body, vars, input),
    brandTitle: parsed.brandTitle,
    brandTagline: parsed.brandTagline,
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
  const template = getTemplate(copy, "email.order.template", EMAIL_ORDER_TEMPLATE_DEFAULT);
  const parsed = parseEmailTemplate(template);

  const lineItemsText = (
    input.lineItems.length > 0
      ? input.lineItems
      : [{ productName: input.productName, size: null, quantity: 1, amountLabel: input.totalLabel }]
  )
    .map((item) => {
      const size = item.size ? `, ${item.size}` : "";
      return `- ${item.productName}${size} × ${item.quantity} — ${item.amountLabel}`;
    })
    .join("\n");

  const vars = {
    productName: input.productName,
    lineItems: lineItemsText,
    orderTotal: input.totalLabel,
    customerName: input.customerName ?? "—",
    customerEmail: input.customerEmail ?? "—",
    shippingAddress: input.shipping,
    stripeSessionId: input.stripeSessionId,
  };

  const subject = applyEmailTemplate(parsed.subject, vars);
  const html = emailLayout({
    preheader: `New order: ${input.totalLabel}`,
    eyebrow: parsed.eyebrow,
    title: parsed.headline,
    bodyHtml: renderOrderBodyHtml(parsed.body, vars, input),
    brandTitle: parsed.brandTitle,
    brandTagline: parsed.brandTagline,
  });

  return { subject, text: renderTemplatePlainText(template, vars), html };
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
  const actualTemplate = getTemplate(copy, "email.quote.template", EMAIL_QUOTE_TEMPLATE_DEFAULT);
  const parsed = parseEmailTemplate(actualTemplate);

  const vars = {
    customerName: input.customerName,
    topic: input.topic.toLowerCase(),
    quoteAmount: input.amountLabel,
    quoteNotes: input.quoteNotes?.trim() ?? "",
  };

  const subject = applyEmailTemplate(parsed.subject, vars);
  const headline = applyEmailTemplate(parsed.headline, vars);
  const html = emailLayout({
    preheader: `Your quote is ready — ${input.amountLabel} CAD`,
    eyebrow: parsed.eyebrow,
    title: headline,
    bodyHtml: renderQuoteBodyHtml(parsed.body, vars, input),
    brandTitle: parsed.brandTitle,
    brandTagline: parsed.brandTagline,
  });

  const text = [
    renderTemplatePlainText(actualTemplate, vars),
    input.contactUrl,
  ].join("\n\n");

  return { subject, text, html };
}
