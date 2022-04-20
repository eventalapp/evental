/*
  Warnings:

  - You are about to drop the `attendee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendee" DROP CONSTRAINT "attendee_eventId_fkey";

-- DropForeignKey
ALTER TABLE "attendee" DROP CONSTRAINT "attendee_userId_fkey";

-- DropTable
DROP TABLE "attendee";

-- CreateTable
CREATE TABLE "event_member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "role" "EventRole" NOT NULL DEFAULT E'ATTENDEE',

    CONSTRAINT "event_member_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_member" ADD CONSTRAINT "event_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_member" ADD CONSTRAINT "event_member_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
