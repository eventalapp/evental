import * as Prisma from '@prisma/client';

import { AttendeeWithUser } from './user';

export type SessionCategoryWithCount = {
	sessionCount: number;
} & Prisma.EventSessionCategory;

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: SessionCategoryWithCount | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;
