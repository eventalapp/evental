import { SessionCategoryWithCount } from '@eventalapp/web/pages/api/events/[eid]/sessions/categories';
import { AttendeeWithUser } from '@eventalapp/web/utils/user';
import * as Prisma from '@prisma/client';

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;

export type FullUser = Omit<Prisma.User, 'password'>;

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: SessionCategoryWithCount | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;
