"use client";

import { useActionState, useState } from "react";

import { submitContact, type ContactState } from "@/lib/contact-actions";
import { CONTACT_TOPICS } from "@/lib/contact-topics";
import { isOrderQuoteTopic } from "@/lib/order-quote-topics";

import { ContactReferenceImagesField } from "@/components/ContactReferenceImagesField";

const fieldClassName =
  "mt-1.5 min-h-11 w-full rounded-xl border border-[#19371E]/15 bg-white px-3 py-2.5 text-base text-[#19371E] outline-none ring-[#C5E6A6]/80 focus:border-[#19371E]/25 focus:ring-2";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, null);
  const [topic, setTopic] = useState("");
  const showOrderFields = isOrderQuoteTopic(topic);

  if (state?.ok) {
    return (
      <div
        className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-6 py-10 text-center shadow-sm"
        role="status"
      >
        <p className="text-lg font-semibold text-emerald-900">Message sent</p>
        <p className="mt-2 text-sm text-emerald-900/80">
          Thanks — we have your note. If email notifications are configured, we will get a copy in
          the inbox too.
          {showOrderFields
            ? " We will follow up with a quote once we have reviewed your request."
            : null}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative mt-6 space-y-5">
      <input
        aria-hidden
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute left-0 top-0 h-px w-px opacity-0"
        name="company"
        type="text"
      />

      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          className={fieldClassName}
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClassName}
        />
      </div>
      <div>
        <label
          htmlFor="contact-topic"
          className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
        >
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          required
          defaultValue=""
          onChange={(e) => setTopic(e.target.value)}
          className={`${fieldClassName} cursor-pointer`}
        >
          <option value="" disabled>
            Select a topic
          </option>
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {showOrderFields ? (
        <div className="space-y-5 rounded-2xl border border-[#19371E]/10 bg-[#F4F9EF]/50 p-4">
          <p className="text-sm font-medium text-[#19371E]">Order details</p>
          <div>
            <label
              htmlFor="garmentType"
              className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
            >
              Garment type
            </label>
            <input
              id="garmentType"
              name="garmentType"
              required={showOrderFields}
              placeholder="e.g. crewneck sweater, tote bag, custom tee"
              className={fieldClassName}
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
            >
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              required={showOrderFields}
              placeholder="e.g. 1, 12, 25–50"
              className={fieldClassName}
            />
          </div>
          <div>
            <label
              htmlFor="deadline"
              className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
            >
              Deadline or event date
            </label>
            <input
              id="deadline"
              name="deadline"
              required={showOrderFields}
              placeholder="e.g. June 15, flexible, wedding in September"
              className={fieldClassName}
            />
          </div>
          <ContactReferenceImagesField />
        </div>
      ) : null}

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-semibold tracking-wide text-[#19371E]/50"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          className="mt-1.5 min-h-[8rem] w-full resize-y rounded-xl border border-[#19371E]/15 bg-white px-3 py-2.5 text-base text-[#19371E] outline-none ring-[#C5E6A6]/80 focus:border-[#19371E]/25 focus:ring-2"
        />
      </div>

      {state?.ok === false ? <p className="text-sm text-red-700">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full touch-manipulation rounded-full bg-[#19371E] py-3.5 text-base font-semibold text-[#C5E6A6] shadow-md transition hover:bg-[#2d5a36] disabled:opacity-60"
      >
        {pending ? "Sending…" : showOrderFields ? "Submit order request" : "Send message"}
      </button>
      <p className="text-center text-xs text-[#19371E]/50">We usually reply within 1-2 business days.</p>
    </form>
  );
}
