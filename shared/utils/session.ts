import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';

import { AttendeeWithUser, attendeeWithUserInclude, stripAttendeeWithUser } from './user';

export type SessionCategoryWithCount = {
	sessionCount: number;
} & Prisma.EventSessionCategory;

export const sessionCategoryWithCountInclude = {
	_count: {
		select: { sessions: true }
	}
};

export type SessionCategoryWithCountRaw = Prisma.EventSessionCategory & {
	_count: { sessions: number };
};

export const rawToSessionCategoryWithCount = (sessionCategory: SessionCategoryWithCountRaw) => {
	return {
		sessionCount: sessionCategory._count.sessions,
		...sessionCategory
	};
};

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: SessionCategoryWithCount | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;

export const rawToSessionWithVenue = (session: SessionWithVenueRaw) => {
	const {
		venue,
		category: categoryWithCount,
		_count: { attendees: attendeeCount },
		attendees,
		...rest
	} = session;

	const roleMembers = attendees.map((sessionAttendee) => {
		const { attendee, ...rest } = sessionAttendee;

		return {
			...rest,
			attendee: stripAttendeeWithUser(attendee)
		};
	});

	const category: SessionCategoryWithCount | null = categoryWithCount
		? {
				sessionCount: categoryWithCount?._count.sessions || 0,
				...categoryWithCount
		  }
		: null;

	return {
		...rest,
		attendeeCount,
		roleMembers,
		category,
		venue
	};
};

export const sessionWithVenueInclude = {
	venue: true,
	category: {
		include: sessionCategoryWithCountInclude
	},
	_count: {
		select: { attendees: true }
	},
	attendees: {
		include: attendeeWithUserInclude,
		where: {
			type: Prisma.EventSessionAttendeeType['ROLE']
		}
	}
};

export type SessionWithVenueRaw = Prisma.EventSession & {
	venue: Prisma.EventVenue | null;
	category: (Prisma.EventSessionCategory & { _count: { sessions: number } }) | null;
	_count: { attendees: number };
	attendees: Array<
		Prisma.EventSessionAttendee & {
			attendee: Prisma.EventAttendee & { role: Prisma.EventRole; user: Prisma.User };
		}
	>;
};

export type SessionWithVenueEvent = {
	event: Prisma.Event | null;
} & SessionWithVenue;

export type SessionWithVenueEventRaw = SessionWithVenueRaw & {
	event: Prisma.Event | null;
};

export const sessionWithVenueEventInclude = {
	event: true,
	...sessionWithVenueInclude
};

export const rawToSessionWithVenueEvent = (session: SessionWithVenueEventRaw) => {
	const {
		venue,
		category: categoryWithCount,
		_count: { attendees: attendeeCount },
		attendees
	} = session;

	const roleMembers = attendees.map((sessionAttendee) => {
		const { attendee } = sessionAttendee;

		return {
			...sessionAttendee,
			attendee: stripAttendeeWithUser(attendee)
		};
	});

	const category: SessionCategoryWithCount | null = categoryWithCount
		? {
				sessionCount: categoryWithCount?._count.sessions || 0,
				...categoryWithCount
		  }
		: null;

	return {
		...session,
		attendeeCount,
		roleMembers,
		category,
		venue
	};
};
export const sessionListReducer = (
	acc: Record<string, Record<string, SessionWithVenue[]>>,
	session: SessionWithVenue
) => {
	const day = dayjs(session.startDate).format('YYYY/MM/DD');
	const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

	if (!acc[day]) {
		acc[day] = {};
	}

	if (!acc[day][hour]) {
		acc[day][hour] = [];
	}

	acc[day][hour].push(session);

	return acc;
};
export const sessionWithEventListReducer = (
	acc: Record<string, Record<string, SessionWithVenueEvent[]>>,
	session: SessionWithVenueEvent
) => {
	const day = dayjs(session.startDate).format('YYYY/MM/DD');
	const hour = dayjs(session.startDate).format('YYYY/MM/DD HH:mm');

	if (!acc[day]) {
		acc[day] = {};
	}

	if (!acc[day][hour]) {
		acc[day][hour] = [];
	}

	acc[day][hour].push(session);

	return acc;
};
export const sessionAttendeeReducer = (
	acc: Record<string, AttendeeWithUser[]>,
	attendee: AttendeeWithUser
) => {
	if (!acc[attendee.role.name]) {
		acc[attendee.role.name] = [];
	}
	acc[attendee.role.name].push(attendee);
	return acc;
};
