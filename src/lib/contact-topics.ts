export const CONTACT_TOPICS = [
  "Bulk Order Request",
  "Custom Order Request",
  "Product Inquiries",
  "Order Follow-Up",
  "Other",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export const CONTACT_TOPIC_SET = new Set<string>(CONTACT_TOPICS);
