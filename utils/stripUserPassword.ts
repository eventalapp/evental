import Prisma from '@prisma/client';

export type PasswordlessUser = Omit<Prisma.User, 'password'>;
export type PasswordlessAttendee = PasswordlessUser & Prisma.EventAttendee;
export type AttendeeWithUser = Prisma.EventAttendee & {
	user: PasswordlessUser;
	role: Prisma.EventRole;
};
export type AttendeeWithUserInput = Prisma.EventAttendee & {
	user: Prisma.User;
	role: Prisma.EventRole;
};

export const stripUserPassword = (user: Prisma.User): PasswordlessUser => {
	const { password, ...rest } = user;

	return rest;
};

export const stripUserPasswords = (users: Prisma.User[]): PasswordlessUser[] => {
	return users.map((user) => stripUserPassword(user));
};

export const stripAttendeeWithUserPassword = (
	attendee: AttendeeWithUserInput
): AttendeeWithUser => {
	const { user, ...rest } = attendee;

	const userStripped = stripUserPassword(user);

	return {
		...rest,
		user: userStripped
	};
};

export const stripAttendeesWithUserPassword = (
	attendees: Array<AttendeeWithUserInput>
): AttendeeWithUser[] => {
	return attendees.map((attendee) => stripAttendeeWithUserPassword(attendee));
};
