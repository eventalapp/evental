-- CreateEnum
CREATE TYPE "PrivacyLevel" AS ENUM ('PUBLIC', 'PRIVATE', 'PASSWORD');

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "maxAttendees" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "privacy" "PrivacyLevel" NOT NULL DEFAULT E'PRIVATE';
