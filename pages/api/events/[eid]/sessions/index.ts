import Prisma from '@prisma/client';
import { endOfDay, parseISO, startOfDay } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../prisma/client';
import { api } from '../../../../../utils/api';
import { getEvent } from '../index';
import { getVenue } from '../venues/[vid]';
import { getSessionType } from './types/[tid]';

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	type: Prisma.EventSessionType | null;
	attendeeCount: number;
} & Prisma.EventSession;

export default api({
	async GET({ req }) {
		const { eid, venue, date, type } = req.query;

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

		if (type) {
			const sessionByTypeList = await getSessionsByType(String(eid), String(type));

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
		include: {
			venue: true,
			type: true,
			_count: {
				select: { attendees: true }
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({ attendeeCount: session._count.attendees, ...session }));
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
		include: {
			venue: true,
			type: true,
			_count: {
				select: { attendees: true }
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({ attendeeCount: session._count.attendees, ...session }));
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
		include: {
			venue: true,
			type: true,
			_count: {
				select: { attendees: true }
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({ attendeeCount: session._count.attendees, ...session }));
};

export const getSessionsByType = async (
	eid: string,
	tid: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const type = await getSessionType(eid, tid);

	if (!type) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			typeId: type.id
		},
		include: {
			venue: true,
			type: true,
			_count: {
				select: { attendees: true }
			}
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map((session) => ({ attendeeCount: session._count.attendees, ...session }));
};
