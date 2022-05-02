-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventPermissionRole" AS ENUM ('FOUNDER', 'ORGANIZER', 'ATTENDEE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VIRTUAL', 'IN_PERSON', 'HYBRID');

-- CreateEnum
CREATE TYPE "TimeFormat" AS ENUM ('TWELVE_HOURS', 'TWENTYFOUR_HOURS');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "location" TEXT,
    "description" TEXT,
    "company" TEXT,
    "position" TEXT,
    "website" TEXT,
    "image" TEXT NOT NULL DEFAULT E'/images/default-avatar.jpg',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT E'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "address" TEXT,
    "timeFormat" "TimeFormat" NOT NULL DEFAULT E'TWELVE_HOURS',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" "EventType",
    "image" TEXT NOT NULL DEFAULT E'/images/default-event.jpg',
    "banner" TEXT,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_attendee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventRoleId" TEXT NOT NULL,
    "permissionRole" "EventPermissionRole" NOT NULL,

    CONSTRAINT "event_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_role" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultRole" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "event_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_session" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_session_attendee" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "attendeeId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "event_session_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_venue" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_venue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_slug_key" ON "user"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_slug_key" ON "event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_attendee_eventId_userId_key" ON "event_attendee"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "event_role_eventId_slug_key" ON "event_role"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_session_eventId_slug_key" ON "event_session"("eventId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_session_attendee_eventId_sessionId_attendeeId_key" ON "event_session_attendee"("eventId", "sessionId", "attendeeId");

-- CreateIndex
CREATE UNIQUE INDEX "event_venue_eventId_slug_key" ON "event_venue"("eventId", "slug");

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_attendee" ADD CONSTRAINT "event_attendee_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "event_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_role" ADD CONSTRAINT "event_role_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session" ADD CONSTRAINT "event_session_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "event_venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_attendeeId_fkey" FOREIGN KEY ("attendeeId") REFERENCES "event_attendee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_session_attendee" ADD CONSTRAINT "event_session_attendee_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "event_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_venue" ADD CONSTRAINT "event_venue_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
