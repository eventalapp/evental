/*
  Warnings:

  - The values [PASSWORD] on the enum `PrivacyLevel` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PrivacyLevel_new" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');
ALTER TABLE "event" ALTER COLUMN "privacy" DROP DEFAULT;
ALTER TABLE "event" ALTER COLUMN "privacy" TYPE "PrivacyLevel_new" USING ("privacy"::text::"PrivacyLevel_new");
ALTER TYPE "PrivacyLevel" RENAME TO "PrivacyLevel_old";
ALTER TYPE "PrivacyLevel_new" RENAME TO "PrivacyLevel";
DROP TYPE "PrivacyLevel_old";
ALTER TABLE "event" ALTER COLUMN "privacy" SET DEFAULT 'PRIVATE';
COMMIT;
