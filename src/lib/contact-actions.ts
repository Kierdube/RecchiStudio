"use server";

import { Resend } from "resend";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const submissionSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(200),
  email: z.string().trim().email("Please enter a valid email").max(254),
  message: z.string().trim().min(1, "Please enter a message").max(8000),
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
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join(" ") };
  }

  const { name, email, message } = parsed.data;

  try {
    await prisma.contactSubmission.create({
      data: { name, email, message },
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
      await resend.emails.send({
        from,
        to: [to],
        replyTo: email,
        subject: `Recchi Studio contact: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      });
    } catch {
      // Saved to DB; email is best-effort
    }
  }

  return { ok: true };
}
