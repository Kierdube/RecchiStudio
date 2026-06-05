-- AlterTable
ALTER TABLE "Product" ADD COLUMN "customFieldsJson" TEXT NOT NULL DEFAULT '[]';

-- Migrate legacy single custom field into customFieldsJson
UPDATE "Product"
SET "customFieldsJson" = json_build_array(
  json_build_object(
    'label',
    CASE
      WHEN trim("optionsLabel") = '' THEN 'Option'
      ELSE trim("optionsLabel")
    END,
    'options',
    "sizesJson"::json
  )
)::text
WHERE "sizesJson" IS NOT NULL
  AND "sizesJson" <> '[]'
  AND "sizesJson" <> '';
