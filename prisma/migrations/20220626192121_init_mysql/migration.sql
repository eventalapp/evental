-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `location` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL DEFAULT '/images/default-avatar.jpg',
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',

    UNIQUE INDEX `user_slug_key`(`slug`),
    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `level` ENUM('TRIAL', 'PRO') NOT NULL DEFAULT 'TRIAL',
    `timeFormat` ENUM('TWELVE_HOURS', 'TWENTYFOUR_HOURS') NOT NULL DEFAULT 'TWELVE_HOURS',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `type` ENUM('VIRTUAL', 'IN_PERSON', 'HYBRID') NOT NULL DEFAULT 'HYBRID',
    `category` ENUM('EVENT', 'ACADEMIC', 'BUSINESS', 'CONFERENCE', 'CONVENTION', 'FESTIVAL', 'OTHER') NOT NULL DEFAULT 'EVENT',
    `privacy` ENUM('PUBLIC', 'PRIVATE', 'UNLISTED') NOT NULL DEFAULT 'PRIVATE',
    `image` VARCHAR(191) NOT NULL DEFAULT '/images/default-event.jpg',
    `banner` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `color` VARCHAR(191) NOT NULL DEFAULT '#0066FF',
    `description` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeZone` VARCHAR(191) NOT NULL DEFAULT 'America/New_York',
    `maxAttendees` INTEGER NOT NULL DEFAULT 5,
    `password` VARCHAR(191) NULL,

    UNIQUE INDEX `event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_attendee` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `eventRoleId` VARCHAR(191) NOT NULL,
    `permissionRole` ENUM('FOUNDER', 'ORGANIZER', 'ATTENDEE') NOT NULL,

    UNIQUE INDEX `event_attendee_eventId_userId_key`(`eventId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_role` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `defaultRole` BOOLEAN NOT NULL DEFAULT false,
    `tinyImage` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `event_role_eventId_slug_key`(`eventId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_session` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `venueId` VARCHAR(191) NULL,
    `typeId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `maxAttendees` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_session_eventId_slug_key`(`eventId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_session_type` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `color` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `event_session_type_eventId_slug_key`(`eventId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_session_attendee` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `attendeeId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `type` ENUM('ATTENDEE', 'ROLE') NOT NULL DEFAULT 'ATTENDEE',

    UNIQUE INDEX `event_session_attendee_eventId_sessionId_attendeeId_key`(`eventId`, `sessionId`, `attendeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_venue` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_venue_eventId_slug_key`(`eventId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_page` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NULL,
    `topLevel` BOOLEAN NOT NULL DEFAULT false,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_page_eventId_slug_key`(`eventId`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_message` (
    `id` VARCHAR(191) NOT NULL,
    `sentBy` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `event_attendee` ADD CONSTRAINT `event_attendee_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_attendee` ADD CONSTRAINT `event_attendee_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_attendee` ADD CONSTRAINT `event_attendee_eventRoleId_fkey` FOREIGN KEY (`eventRoleId`) REFERENCES `event_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_role` ADD CONSTRAINT `event_role_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session` ADD CONSTRAINT `event_session_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session` ADD CONSTRAINT `event_session_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `event_session_type`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session` ADD CONSTRAINT `event_session_venueId_fkey` FOREIGN KEY (`venueId`) REFERENCES `event_venue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session_type` ADD CONSTRAINT `event_session_type_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session_attendee` ADD CONSTRAINT `event_session_attendee_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session_attendee` ADD CONSTRAINT `event_session_attendee_attendeeId_fkey` FOREIGN KEY (`attendeeId`) REFERENCES `event_attendee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_session_attendee` ADD CONSTRAINT `event_session_attendee_sessionId_fkey` FOREIGN KEY (`sessionId`) REFERENCES `event_session`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_venue` ADD CONSTRAINT `event_venue_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_page` ADD CONSTRAINT `event_page_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_message` ADD CONSTRAINT `event_message_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
