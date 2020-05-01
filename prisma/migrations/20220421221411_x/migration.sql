/*
  Warnings:

  - You are about to drop the column `location` on the `event_session` table. All the data in the column will be lost.
  - Added the required column `venueId` to the `event_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_session" DROP COLUMN "location",
ADD COLUMN     "venueId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "event_venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
