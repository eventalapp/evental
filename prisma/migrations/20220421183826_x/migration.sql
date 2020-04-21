/*
  Warnings:

  - You are about to drop the column `role` on the `event_member` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EventPermissionRole" AS ENUM ('FOUNDER', 'ORGANIZER', 'ATTENDEE');

-- AlterTable
ALTER TABLE "event_member" DROP COLUMN "role",
ADD COLUMN     "permissionRole" "EventPermissionRole" NOT NULL DEFAULT E'ATTENDEE';

-- DropEnum
DROP TYPE "EventRole";
