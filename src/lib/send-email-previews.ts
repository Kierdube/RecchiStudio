import { Resend } from "resend";

import {
  contactNotificationEmail,
  orderNotificationEmail,
  quoteReadyEmail,
} from "@/lib/email-templates";
import { siteUrl } from "@/lib/seo";
import { getSiteCopyRecord } from "@/lib/site-copy";

export type EmailPreviewResult = {
  label: string;
  ok: boolean;
  id?: string;
  error?: string;
};

export type EmailPreviewId = "contact" | "order" | "quote";

export type EmailPreviewDocument = {
  id: EmailPreviewId;
  label: string;
  subject: string;
  html: string;
};

function resendFromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || "Recchi Studio <onboarding@resend.dev>";
}

export function emailPreviewSamples(copy: Record<string, string>) {
  const contactUrl = `${siteUrl().replace(/\/$/, "")}/contact`;

  return [
    {
      id: "contact" as const,
      label: "Contact notification",
      ...contactNotificationEmail(
        {
        name: "Alex Preview",
        email: "customer@example.com",
        topic: "Custom Order Request",
        message:
          "Hi! I would love a custom flamingo sweater for a small team gift. Happy to discuss colours and timeline.",
        garmentType: "Crewneck sweater",
        quantity: "8",
        deadline: "September 15",
        referenceImageUrls: ["https://recchistudio.com/icon.png"],
        },
        copy,
      ),
    },
    {
      id: "order" as const,
      label: "Order notification (admin)",
      ...orderNotificationEmail(
        {
        productName: "Flamingo Garden Tee",
        lineItems: [
          {
            productName: "Flamingo Garden Tee",
            size: "M",
            quantity: 1,
            amountLabel: "$42.00",
          },
          {
            productName: "Abstract Birds Crop Top",
            size: "S",
            quantity: 2,
            amountLabel: "$68.00",
          },
        ],
        totalLabel: "$110.00",
        customerName: "Jordan Preview",
        customerEmail: "jordan@example.com",
        shipping: "Jordan Preview\n123 Queen St W\nToronto, ON M5H 2M9\nCA",
        stripeSessionId: "cs_test_preview_12345",
        },
        copy,
      ),
    },
    {
      id: "quote" as const,
      label: "Quote ready (customer)",
      ...quoteReadyEmail(
        {
        customerName: "Alex Preview",
        topic: "Custom Order Request",
        amountLabel: "$640.00",
        quoteNotes:
          "Eight crewneck sweaters with your custom flamingo colourway.\nEstimated turnaround: 3–4 weeks after approval.\n50% deposit to start; balance before shipping.",
        contactUrl,
        },
        copy,
      ),
    },
  ];
}

export async function getEmailPreviewDocuments(): Promise<EmailPreviewDocument[]> {
  const copy = await getSiteCopyRecord();
  return emailPreviewSamples(copy).map(({ id, label, subject, html }) => ({
    id,
    label,
    subject,
    html,
  }));
}

export async function sendEmailPreviews(to?: string): Promise<{
  ok: boolean;
  to: string;
  results: EmailPreviewResult[];
}> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const inbox = to?.trim() || process.env.CONTACT_TO_EMAIL?.trim();

  if (!resendKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!inbox) {
    throw new Error("CONTACT_TO_EMAIL is not configured.");
  }

  const resend = new Resend(resendKey);
  const from = resendFromAddress();
  const copy = await getSiteCopyRecord();
  const results: EmailPreviewResult[] = [];

  for (const preview of emailPreviewSamples(copy)) {
    const subject = `[Preview] ${preview.subject}`;
    const { data, error } = await resend.emails.send({
      from,
      to: [inbox],
      subject,
      text: preview.text,
      html: preview.html,
    });

    if (error) {
      results.push({
        label: preview.label,
        ok: false,
        error: typeof error === "object" && error && "message" in error ? String(error.message) : "Send failed",
      });
      continue;
    }

    results.push({ label: preview.label, ok: true, id: data?.id });
  }

  return {
    ok: results.every((r) => r.ok),
    to: inbox,
    results,
  };
}
