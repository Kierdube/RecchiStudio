import type { SiteCopyDefinition } from "@/lib/site-copy-definitions";
import {
  EMAIL_CONTACT_TEMPLATE_DEFAULT,
  EMAIL_ORDER_TEMPLATE_DEFAULT,
  EMAIL_QUOTE_TEMPLATE_DEFAULT,
} from "@/lib/email-template-defaults";

/** One editable template per transactional email (admin → Content → Emails). */
export const EMAIL_COPY_DEFINITIONS: SiteCopyDefinition[] = [
  {
    group: "Emails — contact alert (to you)",
    key: "email.contact.template",
    label: "Contact form alert template",
    format: "plain",
    defaultValue: EMAIL_CONTACT_TEMPLATE_DEFAULT,
  },
  {
    group: "Emails — new order (to you)",
    key: "email.order.template",
    label: "New order alert template",
    format: "plain",
    defaultValue: EMAIL_ORDER_TEMPLATE_DEFAULT,
  },
  {
    group: "Emails — quote ready (to customer)",
    key: "email.quote.template",
    label: "Quote ready email template",
    format: "plain",
    defaultValue: EMAIL_QUOTE_TEMPLATE_DEFAULT,
  },
];
