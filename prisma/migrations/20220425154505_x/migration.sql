/*
  Warnings:

  - You are about to drop the column `company` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_member" ADD COLUMN     "company" TEXT,
ADD COLUMN     "position" TEXT;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "company",
DROP COLUMN "position";
