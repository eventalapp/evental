import { prisma } from '@eventalapp/shared/db/client';
import * as Prisma from '@prisma/client';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NextkitError } from 'nextkit';

import { api } from '../../../../../utils/api';
import {
	AttendeeWithUser,
	attendeeWithUserInclude,
	stripAttendeeWithUser
} from '../../../../../utils/user';
import { getEvent } from '../index';
import { getVenue } from '../venues/[vid]';
import { SessionCategoryWithCount, sessionCategoryWithCountInclude } from './categories';
import { getSessionCategory } from './categories/[cid]';

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	category: SessionCategoryWithCount | null;
	attendeeCount: number;
	roleMembers: Array<Prisma.EventSessionAttendee & { attendee: AttendeeWithUser }>;
} & Prisma.EventSession;

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

export const rawToSessionWithVenue = (session: SessionWithVenueRaw) => {
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

export default api({
	async GET({ req }) {
		const { eid, venue, date, category } = req.query;

		if (venue) {
			const sessionByVenueList = await getSessionsByVenue(String(eid), String(venue));

			if (!sessionByVenueList) {
				throw new NextkitError(404, 'Sessions by venue not found');
			}

			return sessionByVenueList;
		}

		if (date) {
			const sessionByDateList = await getSessionsByDate(String(eid), String(date));

			if (!sessionByDateList) {
				throw new NextkitError(404, 'Sessions by date not found');
			}

			return sessionByDateList;
		}

		if (category) {
			const sessionByTypeList = await getSessionsByCategory(String(eid), String(category));

			if (!sessionByTypeList) {
				throw new NextkitError(404, 'Sessions by type not found');
			}

			return sessionByTypeList;
		}

		const sessionList = await getSessions(String(eid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessions = async (eid: string): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id
		},
		include: sessionWithVenueInclude,
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map(rawToSessionWithVenue);
};

export const getSessionsByVenue = async (
	eid: string,
	vid: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const venue = await getVenue(eid, vid);

	if (!venue) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			venueId: venue.id
		},
		include: sessionWithVenueInclude,
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map(rawToSessionWithVenue);
};

export const getSessionsByDate = async (
	eid: string,
	date: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const dateParsed = parseISO(String(date));
	const dateParsedStart = zonedTimeToUtc(startOfDay(dateParsed), event.timeZone);
	const dateParsedEnd = zonedTimeToUtc(endOfDay(dateParsed), event.timeZone);

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			OR: [
				{
					startDate: {
						gte: dateParsedStart,
						lte: dateParsedEnd
					}
				},
				{
					endDate: {
						gte: dateParsedStart,
						lte: dateParsedEnd
					}
				},
				{
					AND: {
						startDate: { lte: dateParsedStart },
						endDate: { gte: dateParsedEnd }
					}
				}
			]
		},
		include: sessionWithVenueInclude,
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map(rawToSessionWithVenue);
};

export const getSessionsByCategory = async (
	eid: string,
	cid: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const type = await getSessionCategory(eid, cid);

	if (!type) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			categoryId: type.id
		},
		include: sessionWithVenueInclude,
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map(rawToSessionWithVenue);
};
