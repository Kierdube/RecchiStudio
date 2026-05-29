-- Convert legacy USD-cent prices to CAD cents (approximate rate used at migration time).
UPDATE "Product" SET "priceCents" = ROUND("priceCents" * 1.38) WHERE "priceCents" > 0;
