/*
  Warnings:

  - A unique constraint covering the columns `[eventId,slug]` on the table `event_venue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `event_venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_venue" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_venue_eventId_slug_key" ON "event_venue"("eventId", "slug");
