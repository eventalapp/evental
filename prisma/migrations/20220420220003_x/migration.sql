/*
  Warnings:

  - Added the required column `location` to the `event_session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_session" ADD COLUMN     "location" TEXT NOT NULL;
