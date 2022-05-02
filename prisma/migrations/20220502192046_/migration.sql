-- CreateEnum
CREATE TYPE "EventLevel" AS ENUM ('TRIAL', 'PRO');

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "level" "EventLevel" NOT NULL DEFAULT E'TRIAL';
