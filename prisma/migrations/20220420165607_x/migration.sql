-- CreateEnum
CREATE TYPE "EventRole" AS ENUM ('FOUNDER', 'ORGANIZER', 'ATTENDEE');

-- AlterTable
ALTER TABLE "attendee" ADD COLUMN     "role" "EventRole" NOT NULL DEFAULT E'ATTENDEE';
