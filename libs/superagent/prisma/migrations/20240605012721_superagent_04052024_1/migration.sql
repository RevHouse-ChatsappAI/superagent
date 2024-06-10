/*
  Warnings:

  - The values [XLS] on the enum `DatasourceType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DatasourceType_new" AS ENUM ('TXT', 'PDF', 'CSV', 'PPTX', 'XLSX', 'DOCX', 'GOOGLE_DOC', 'YOUTUBE', 'GITHUB_REPOSITORY', 'MARKDOWN', 'WEBPAGE', 'AIRTABLE', 'STRIPE', 'NOTION', 'SITEMAP', 'URL', 'FUNCTION');
ALTER TABLE "Datasource" ALTER COLUMN "type" TYPE "DatasourceType_new" USING ("type"::text::"DatasourceType_new");
ALTER TYPE "DatasourceType" RENAME TO "DatasourceType_old";
ALTER TYPE "DatasourceType_new" RENAME TO "DatasourceType";
DROP TYPE "DatasourceType_old";
COMMIT;
