/*
  Warnings:

  - You are about to drop the column `company` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `event_attendee` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `event_attendee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `event_attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "event_attendee_eventId_slug_key";

-- AlterTable
ALTER TABLE "event_attendee" DROP COLUMN "company",
DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "position",
DROP COLUMN "slug";

-- CreateIndex
CREATE UNIQUE INDEX "event_attendee_eventId_userId_key" ON "event_attendee"("eventId", "userId");
