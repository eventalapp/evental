/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");
