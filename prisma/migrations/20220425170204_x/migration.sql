/*
  Warnings:

  - You are about to drop the `event_member` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_member" DROP CONSTRAINT "event_member_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_member" DROP CONSTRAINT "event_member_eventRoleId_fkey";

-- DropForeignKey
ALTER TABLE "event_member" DROP CONSTRAINT "event_member_userId_fkey";

-- DropTable
DROP TABLE "event_member";

-- CreateTable
CREATE TABLE "event_attendee" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventRoleId" TEXT NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "permissionRole" "EventPermissionRole" NOT NULL,

    CONSTRAINT "event_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_attendee_eventId_slug_key" ON "event_attendee"("eventId", "slug");

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "event_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
