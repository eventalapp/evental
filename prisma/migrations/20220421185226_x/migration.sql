/*
  Warnings:

  - You are about to drop the column `userId` on the `event_role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_role" DROP CONSTRAINT "event_role_userId_fkey";

-- AlterTable
ALTER TABLE "event_member" ALTER COLUMN "permissionRole" DROP DEFAULT;

-- AlterTable
ALTER TABLE "event_role" DROP COLUMN "userId";
