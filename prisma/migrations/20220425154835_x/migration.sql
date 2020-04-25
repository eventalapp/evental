/*
  Warnings:

  - Added the required column `name` to the `event_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_member" ADD COLUMN     "name" TEXT NOT NULL;
