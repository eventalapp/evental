/*
  Warnings:

  - Made the column `image` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event" ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "event_attendee" ADD COLUMN     "image" TEXT NOT NULL DEFAULT E'/images/default-avatar.jpg';

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "image" SET DEFAULT E'/images/default-avatar.jpg';
