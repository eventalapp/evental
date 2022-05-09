-- CreateTable
CREATE TABLE "event_page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "body" TEXT,
    "topLevel" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_page_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_page_eventId_slug_key" ON "event_page"("eventId", "slug");

-- AddForeignKey
ALTER TABLE "event_page" ADD CONSTRAINT "event_page_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
