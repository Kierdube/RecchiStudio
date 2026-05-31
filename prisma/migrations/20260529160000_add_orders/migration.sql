-- Order table may already exist from an earlier production deploy; align with current schema.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "size" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'amountTotalCents'
  ) THEN
    ALTER TABLE "Order" RENAME COLUMN "amountTotalCents" TO "amountCents";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Order' AND column_name = 'shippingAddressJson'
  ) THEN
    ALTER TABLE "Order" RENAME COLUMN "shippingAddressJson" TO "shippingJson";
  END IF;
END $$;

ALTER TABLE "Order" ALTER COLUMN "currency" SET DEFAULT 'cad';

CREATE UNIQUE INDEX IF NOT EXISTS "Order_stripeSessionId_key" ON "Order"("stripeSessionId");
CREATE INDEX IF NOT EXISTS "Order_createdAt_idx" ON "Order"("createdAt");
