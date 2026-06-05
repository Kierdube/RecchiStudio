export const ORDER_QUOTE_TOPICS = ["Custom Order Request", "Bulk Order Request"] as const;

export type OrderQuoteTopic = (typeof ORDER_QUOTE_TOPICS)[number];

export const ORDER_QUOTE_TOPIC_SET = new Set<string>(ORDER_QUOTE_TOPICS);

export function isOrderQuoteTopic(topic: string): topic is OrderQuoteTopic {
  return ORDER_QUOTE_TOPIC_SET.has(topic);
}

export const QUOTE_STATUSES = ["inbox", "quote_draft", "quote_sent", "closed"] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export function quoteStatusLabel(status: string): string {
  switch (status) {
    case "quote_draft":
      return "Quote draft";
    case "quote_sent":
      return "Quote sent";
    case "closed":
      return "Closed";
    default:
      return "Inbox";
  }
}
