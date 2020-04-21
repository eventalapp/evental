/*
  Warnings:

  - You are about to drop the column `location` on the `event_activity` table. All the data in the column will be lost.
  - Added the required column `venueId` to the `event_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_activity" DROP COLUMN "location",
ADD COLUMN     "venueId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "event_activity" ADD CONSTRAINT "event_activity_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "event_venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
