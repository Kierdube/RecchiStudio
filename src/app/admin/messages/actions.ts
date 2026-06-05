"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { isOrderQuoteTopic } from "@/lib/order-quote-topics";
import { sendQuoteReadyEmail } from "@/lib/send-quote-email";
import { adminDollarsToCatalogCents } from "@/lib/admin-pricing";

export type QuoteActionState = { error: string } | { ok: true; message: string } | null;

const quoteDraftSchema = z.object({
  id: z.string().min(1),
  quoteNotes: z.string().max(8000).optional(),
  quoteAmountDollars: z.coerce.number().min(0.01).max(999999),
});

export async function saveQuoteDraft(
  _prev: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const parsed = quoteDraftSchema.safeParse({
    id: formData.get("id"),
    quoteNotes: String(formData.get("quoteNotes") ?? ""),
    quoteAmountDollars: formData.get("quoteAmountDollars"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const message = await prisma.contactSubmission.findUnique({ where: { id: parsed.data.id } });
  if (!message || !isOrderQuoteTopic(message.topic)) {
    return { error: "Quote not found" };
  }

  await prisma.contactSubmission.update({
    where: { id: parsed.data.id },
    data: {
      quoteNotes: parsed.data.quoteNotes?.trim() || null,
      quoteAmountCents: adminDollarsToCatalogCents(parsed.data.quoteAmountDollars),
      status: "quote_draft",
    },
  });

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${parsed.data.id}`);
  return { ok: true, message: "Quote draft saved." };
}

export async function sendQuoteToCustomer(
  _prev: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const parsed = quoteDraftSchema.safeParse({
    id: formData.get("id"),
    quoteNotes: String(formData.get("quoteNotes") ?? ""),
    quoteAmountDollars: formData.get("quoteAmountDollars"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const message = await prisma.contactSubmission.findUnique({ where: { id: parsed.data.id } });
  if (!message || !isOrderQuoteTopic(message.topic)) {
    return { error: "Quote not found" };
  }

  const quoteAmountCents = adminDollarsToCatalogCents(parsed.data.quoteAmountDollars);
  const quoteNotes = parsed.data.quoteNotes?.trim() || null;

  const emailResult = await sendQuoteReadyEmail({
    customerEmail: message.email,
    customerName: message.name,
    topic: message.topic,
    quoteNotes,
    quoteAmountCents,
  });

  if (!emailResult.ok) {
    return { error: emailResult.error };
  }

  await prisma.contactSubmission.update({
    where: { id: parsed.data.id },
    data: {
      quoteNotes,
      quoteAmountCents,
      status: "quote_sent",
      quoteSentAt: new Date(),
    },
  });

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${parsed.data.id}`);
  return { ok: true, message: `Quote emailed to ${message.email}.` };
}

export async function closeQuoteRequest(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await prisma.contactSubmission.update({
    where: { id },
    data: { status: "closed" },
  });

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  redirect(`/admin/messages/${id}`);
}
