/*
  Warnings:

  - Added the required column `eventRoleId` to the `event_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_member" ADD COLUMN     "eventRoleId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "event_role" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "event_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_role_role_key" ON "event_role"("role");

-- AddForeignKey
ALTER TABLE "event_member" ADD CONSTRAINT "event_member_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "event_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_role" ADD CONSTRAINT "event_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_role" ADD CONSTRAINT "event_role_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
