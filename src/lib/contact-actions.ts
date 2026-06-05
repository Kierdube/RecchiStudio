"use server";

import { Resend } from "resend";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { CONTACT_TOPIC_SET } from "@/lib/contact-topics";
import { isOrderQuoteTopic } from "@/lib/order-quote-topics";
import {
  parseReferenceImageUrls,
  serializeReferenceImagesJson,
} from "@/lib/reference-images";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.string().trim().email("Please enter a valid email").max(254),
  topic: z
    .string()
    .trim()
    .refine((v) => CONTACT_TOPIC_SET.has(v), "Please select a topic"),
  message: z.string().trim().min(1, "Please enter a message").max(8000),
  garmentType: z.string().trim().max(200).optional(),
  quantity: z.string().trim().max(100).optional(),
  deadline: z.string().trim().max(200).optional(),
  referenceImagesJson: z.string().optional(),
});

export type ContactState =
  | { ok: true }
  | { ok: false; error: string }
  | null;

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const honeypot = String(formData.get("company") ?? "").trim();
  if (honeypot.length > 0) {
    return { ok: true };
  }

  const parsed = submissionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
    garmentType: String(formData.get("garmentType") ?? "").trim() || undefined,
    quantity: String(formData.get("quantity") ?? "").trim() || undefined,
    deadline: String(formData.get("deadline") ?? "").trim() || undefined,
    referenceImagesJson: String(formData.get("referenceImagesJson") ?? ""),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const { name, email, topic, message } = parsed.data;
  const isOrderQuote = isOrderQuoteTopic(topic);

  if (isOrderQuote) {
    if (!parsed.data.garmentType) {
      return { ok: false, error: "Please enter a garment type." };
    }
    if (!parsed.data.quantity) {
      return { ok: false, error: "Please enter a quantity." };
    }
    if (!parsed.data.deadline) {
      return { ok: false, error: "Please enter a deadline or event date." };
    }
  }

  const referenceImages = isOrderQuote
    ? parseReferenceImageUrls(parsed.data.referenceImagesJson ?? "")
    : [];

  try {
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        topic,
        message,
        garmentType: isOrderQuote ? parsed.data.garmentType : null,
        quantity: isOrderQuote ? parsed.data.quantity : null,
        deadline: isOrderQuote ? parsed.data.deadline : null,
        referenceImagesJson: isOrderQuote
          ? serializeReferenceImagesJson(referenceImages)
          : "[]",
        status: "inbox",
      },
    });
  } catch {
    return { ok: false, error: "Could not save your message. Please try again later." };
  }

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from =
    process.env.RESEND_FROM_EMAIL ?? "Recchi Studio <onboarding@resend.dev>";

  if (resendKey && to) {
    try {
      const resend = new Resend(resendKey);
      const orderDetails = isOrderQuote
        ? [
            "",
            "Order details:",
            `Garment: ${parsed.data.garmentType}`,
            `Quantity: ${parsed.data.quantity}`,
            `Deadline: ${parsed.data.deadline}`,
            referenceImages.length > 0
              ? `Reference images:\n${referenceImages.map((u) => `- ${u}`).join("\n")}`
              : null,
          ]
            .filter(Boolean)
            .join("\n")
        : "";

      await resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: `Recchi Studio contact (${topic}): ${name}`,
        text: `From: ${name} <${email}>\nTopic: ${topic}${orderDetails}\n\n${message}`,
      });
    } catch {
      // Saved to DB; email is best-effort
    }
  }

  return { ok: true };
}
