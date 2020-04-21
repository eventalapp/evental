-- AlterTable
ALTER TABLE "event" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "company" TEXT,
ADD COLUMN     "position" TEXT;

-- CreateTable
CREATE TABLE "event_venue" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_venue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_venue" ADD CONSTRAINT "event_venue_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
