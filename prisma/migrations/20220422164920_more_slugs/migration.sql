/*
  Warnings:

  - A unique constraint covering the columns `[eventId,slug]` on the table `event_session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `event_member` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventId,slug]` on the table `event_member` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `event_session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `event_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_session" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "event_member" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_session_eventId_slug_key" ON "event_session"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_member_slug_key" ON "event_member"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_member_eventId_slug_key" ON "event_member"("eventId", "slug");
