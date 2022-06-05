-- CreateTable
CREATE TABLE "event_message" (
    "id" TEXT NOT NULL,
    "sentAt" TEXT NOT NULL,
    "sentBy" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "body" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_message" ADD CONSTRAINT "event_message_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
