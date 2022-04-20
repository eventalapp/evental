-- CreateTable
CREATE TABLE "event_activity" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_activity" ADD CONSTRAINT "event_activity_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
