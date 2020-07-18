import * as Prisma from '@prisma/client';

export type SessionCategoryWithCount = {
	sessionCount: number;
} & Prisma.EventSessionCategory;

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;

export type FullUser = Omit<Prisma.User, 'password'>;

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: SessionCategoryWithCount | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;

export type AttendeeWithUser = Prisma.EventAttendee & {
	user: StrippedUser;
	role: Prisma.EventRole;
};
