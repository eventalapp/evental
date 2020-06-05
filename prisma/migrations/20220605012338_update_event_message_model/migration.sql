/*
  Warnings:

  - You are about to drop the column `sentAt` on the `event_message` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `event_message` table. All the data in the column will be lost.
  - Made the column `body` on table `event_message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event_message" DROP COLUMN "sentAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "sentBy" DROP NOT NULL,
ALTER COLUMN "body" SET NOT NULL;
