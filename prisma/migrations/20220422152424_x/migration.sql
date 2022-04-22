/*
  Warnings:

  - You are about to drop the column `role` on the `event_role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,slug]` on the table `event_role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `event_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `event_role` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "event_role_eventId_role_key";

-- AlterTable
ALTER TABLE "event_role" DROP COLUMN "role",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_role_eventId_slug_key" ON "event_role"("eventId", "slug");
