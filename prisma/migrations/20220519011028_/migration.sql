-- CreateEnum
CREATE TYPE "EventSessionAttendeeType" AS ENUM ('ATTENDEE', 'ROLE');

-- AlterTable
ALTER TABLE "event_session_attendee" ADD COLUMN     "type" "EventSessionAttendeeType" NOT NULL DEFAULT E'ATTENDEE';
