-- DropForeignKey
ALTER TABLE "event_attendee" DROP CONSTRAINT "event_attendee_eventRoleId_fkey";

-- AlterTable
ALTER TABLE "event_session" ADD COLUMN     "typeId" TEXT;

-- CreateTable
CREATE TABLE "event_session_type" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "event_session_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_session_type_eventId_slug_key" ON "event_session_type"("eventId", "slug");

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "event_role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "event_session_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_type" ADD CONSTRAINT "event_session_type_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
