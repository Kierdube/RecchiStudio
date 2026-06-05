import { Resend } from "resend";

import { formatCatalogCentsForAdmin } from "@/lib/admin-pricing";
import { siteUrl } from "@/lib/seo";

function formatQuoteMoney(cents: number): string {
  return formatCatalogCentsForAdmin(cents);
}

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
  const amount = formatQuoteMoney(input.quoteAmountCents);
  const notesBlock = input.quoteNotes?.trim()
    ? `\n\nDetails:\n${input.quoteNotes.trim()}`
    : "";

  const text = [
    `Hi ${input.customerName},`,
    "",
    `Your ${input.topic.toLowerCase()} quote from Recchi Studio is ready.`,
    "",
    `Quoted total: ${amount} CAD`,
    notesBlock,
    "",
    "Reply to this email or use our contact page if you would like to proceed or have questions:",
    contactUrl,
    "",
    "— Recchi Studio",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from,
      to: [input.customerEmail],
      subject: `Your Recchi Studio quote is ready`,
      text,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send email. Check Resend configuration." };
  }
}
