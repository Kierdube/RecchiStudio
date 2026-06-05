-- Enable random bytes for preview token backfill (Neon/Postgres)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- AlterTable ContactSubmission: order quote workflow fields
ALTER TABLE "ContactSubmission" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "ContactSubmission" ADD COLUMN "garmentType" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "quantity" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "deadline" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "referenceImagesJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "ContactSubmission" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'inbox';
ALTER TABLE "ContactSubmission" ADD COLUMN "quoteNotes" TEXT;
ALTER TABLE "ContactSubmission" ADD COLUMN "quoteAmountCents" INTEGER;
ALTER TABLE "ContactSubmission" ADD COLUMN "quoteSentAt" TIMESTAMP(3);

-- AlterTable Product: SEO + draft preview
ALTER TABLE "Product" ADD COLUMN "metaTitle" TEXT;
ALTER TABLE "Product" ADD COLUMN "metaDescription" TEXT;
ALTER TABLE "Product" ADD COLUMN "previewToken" TEXT;

-- Backfill preview tokens for existing products
UPDATE "Product"
SET "previewToken" = encode(gen_random_bytes(24), 'hex')
WHERE "previewToken" IS NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_previewToken_key" ON "Product"("previewToken");
