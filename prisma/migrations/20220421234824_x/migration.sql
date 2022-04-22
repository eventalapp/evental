/*
  Warnings:

  - A unique constraint covering the columns `[eventId,role]` on the table `event_role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "event_role_role_key";

-- CreateIndex
CREATE UNIQUE INDEX "event_role_eventId_role_key" ON "event_role"("eventId", "role");
