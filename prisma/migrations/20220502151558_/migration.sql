-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('EVENT', 'ACADEMIC', 'BUSINESS', 'CONFERENCE', 'CONVENTION', 'FESTIVAL', 'OTHER');

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT E'EVENT';
