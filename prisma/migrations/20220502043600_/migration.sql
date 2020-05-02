-- CreateTable
CREATE TABLE "event_session_attendee" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_session_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_session_attendee_eventId_sessionId_attendeeId_key" ON "event_session_attendee"("eventId", "sessionId", "attendeeId");

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "event_attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
