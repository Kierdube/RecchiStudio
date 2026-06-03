UPDATE "SiteCopyBlock"
SET
  value = $mdx$# Shipping & returns

## Shipping

- **Free shipping** on all orders shipped within **Canada** and the **United States**.
- Orders typically ship within **2–5 business days** unless stated otherwise on the product page.
- Tracking is sent by email when your package leaves our studio or fulfillment partner.
- Orders outside Canada and the US may incur shipping fees, duties, or taxes at checkout or on delivery.

## Returns & exchanges

- We accept returns of unworn items within **14 days of delivery**.
- To start a return, email us with your order number — reach us on the [contact page](/contact).
- **Final sale** items are not eligible for return unless defective.

## Need help?

See [store policies](/policies) or [contact us](/contact).
$mdx$,
  "updatedAt" = NOW()
WHERE key = 'legal.shipping_mdx';

UPDATE "SiteCopyBlock"
SET
  value = 'Free shipping in Canada and the US. How we ship orders, timelines, and returns at Recchi Studio.',
  "updatedAt" = NOW()
WHERE key = 'shipping.meta_description';

UPDATE "SiteCopyBlock"
SET
  value = $mdx$# Store policies

Starter text for a small shop. **Have a lawyer review** before you rely on it in production — this file lives at `content/policies.mdx` so you can edit copy without touching React.

## Terms of service

By placing an order, you agree to pay the listed price plus applicable taxes and shipping. Product colours may vary slightly by screen and print batch.

We reserve the right to cancel orders that look fraudulent or where inventory cannot be fulfilled — you will be refunded in full through your original payment method.

## Privacy

Checkout is processed by our payment provider. We receive the information needed to fulfill your order (name, shipping address, email). We do not store full card numbers on our servers.

## Cookies

This storefront may set essential cookies for checkout flows and admin sessions. Add analytics or marketing cookie language if you enable those tools.

## Contact

Questions about these policies? Use the [contact form](/contact) or the email shown on that page.
$mdx$,
  "updatedAt" = NOW()
WHERE key = 'legal.policies_mdx';

UPDATE "SiteCopyBlock"
SET
  value = 'Browse tees, crop tops, shorts, and more. Secure checkout.',
  "updatedAt" = NOW()
WHERE key = 'footer.catalog_blurb';
