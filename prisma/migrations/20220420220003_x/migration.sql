/*
  Warnings:

  - Added the required column `location` to the `event_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_activity" ADD COLUMN     "location" TEXT NOT NULL;
