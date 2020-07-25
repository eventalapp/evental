import * as Prisma from '@prisma/client';

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;

export type FullUser = Omit<Prisma.User, 'password'>;

export type AttendeeWithUser = Prisma.EventAttendee & {
	user: StrippedUser;
	role: Prisma.EventRole;
};
