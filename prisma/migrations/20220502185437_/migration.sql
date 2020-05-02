-- AlterTable
ALTER TABLE "event_session" ALTER COLUMN "venueId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "event_venue" ADD COLUMN     "address" TEXT;
