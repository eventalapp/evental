-- AlterTable
ALTER TABLE "event" ADD COLUMN     "banner" TEXT,
ADD COLUMN     "image" TEXT DEFAULT E'https://www.gravatar.com/avatar/?d=identicon';
