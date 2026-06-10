import { Resend } from "resend";

import { formatCatalogCentsForAdmin } from "@/lib/admin-pricing";
import { quoteReadyEmail } from "@/lib/email-templates";
import { siteUrl } from "@/lib/seo";
import { getSiteCopyRecord } from "@/lib/site-copy";

export async function sendQuoteReadyEmail(input: {
  customerEmail: string;
  customerName: string;
  topic: string;
  quoteNotes: string | null;
  quoteAmountCents: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Recchi Studio <onboarding@resend.dev>";

  if (!resendKey) {
    return { ok: false, error: "Email is not configured (RESEND_API_KEY missing)." };
  }

  const contactUrl = `${siteUrl().replace(/\/$/, "")}/contact`;
  const amountLabel = formatCatalogCentsForAdmin(input.quoteAmountCents);
  const copy = await getSiteCopyRecord();
  const mail = quoteReadyEmail(
    {
      customerName: input.customerName,
      topic: input.topic,
      amountLabel,
      quoteNotes: input.quoteNotes,
      contactUrl,
    },
    copy,
  );

  try {
    const resend = new Resend(resendKey);
    const { error } = await resend.emails.send({
      from,
      to: [input.customerEmail],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) {
      return { ok: false, error: "Could not send email. Check Resend configuration." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send email. Check Resend configuration." };
  }
}
