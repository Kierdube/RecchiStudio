export const EMAIL_CONTACT_TEMPLATE_DEFAULT = `Subject: Recchi Studio contact ({topic}): {name}

Recchi Studio
Nature-inspired patterns & apparel

Contact form
New message

From: {name} <{email}>
Topic: {topic}
Garment: {garmentType}
Quantity: {quantity}
Deadline: {deadline}

Reference images:
{referenceImages}

Message
{message}`;

export const EMAIL_ORDER_TEMPLATE_DEFAULT = `Subject: New order: {productName}

Recchi Studio
Nature-inspired patterns & apparel

New order
You have a new order

Item | Qty | Amount
{lineItems}

Total: {orderTotal}

Customer: {customerName}
Email: {customerEmail}
Shipping:
{shippingAddress}

Stripe session: {stripeSessionId}`;

export const EMAIL_QUOTE_TEMPLATE_DEFAULT = `Subject: Your Recchi Studio quote is ready

Recchi Studio
Nature-inspired patterns & apparel

Quote ready
Hi {customerName},

Your {topic} quote from Recchi Studio is ready.

Quoted total
{quoteAmount} CAD

Details
{quoteNotes}

Reply to this email or get in touch if you would like to proceed or have any questions.

[Contact us]`;
