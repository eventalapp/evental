/*
  Warnings:

  - Made the column `type` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "event" ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "type" SET DEFAULT E'HYBRID';
