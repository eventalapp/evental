import * as Prisma from '@prisma/client';

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;
export type FullUser = Omit<Prisma.User, 'password'>;

export const attendeeWithUserInclude = {
	attendee: {
		include: {
			user: true,
			role: true
		}
	}
};

export type AttendeeWithUser = Prisma.EventAttendee & {
	user: StrippedUser;
	role: Prisma.EventRole;
};

export type AttendeeWithUserInput = Prisma.EventAttendee & {
	user: Prisma.User;
	role: Prisma.EventRole;
};

export const fullUser = (user: Prisma.User): FullUser => {
	const { password, ...rest } = user;

	return rest;
};

export const stripUser = (user: Prisma.User): StrippedUser => {
	const { password, email, role, ...rest } = user;

	return rest;
};

export const stripAttendeeWithUser = (attendee: AttendeeWithUserInput): AttendeeWithUser => {
	const { user, ...rest } = attendee;

	const userStripped = stripUser(user);

	return {
		...rest,
		user: userStripped
	};
};

export const stripAttendeesWithUser = (
	attendees: Array<AttendeeWithUserInput>
): AttendeeWithUser[] => {
	return attendees.map((attendee) => stripAttendeeWithUser(attendee));
};
