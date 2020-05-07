import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';
import { getVenue } from '../venues/[vid]';
import { endOfDay, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { getSessionType } from './types/[tid]';

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	type: Prisma.EventSessionType | null;
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

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id
		},
		include: {
			venue: true,
			type: true
		},
		orderBy: {
			startDate: 'asc'
		}
	});
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

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			venueId: venue.id
		},
		include: {
			venue: true,
			type: true
		},
		orderBy: {
			startDate: 'asc'
		}
	});
};

export const getSessionsByDate = async (
	eid: string,
	date: string
): Promise<SessionWithVenue[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const dateParsed = startOfDay(parseISO(String(date)));

	if (
		isBefore(dateParsed, new Date(event.startDate)) ||
		isAfter(dateParsed, new Date(event.endDate))
	) {
		return null;
	}

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			startDate: {
				gte: startOfDay(dateParsed),
				lte: endOfDay(dateParsed)
			}
		},
		include: {
			venue: true,
			type: true
		},
		orderBy: {
			startDate: 'asc'
		}
	});
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

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			typeId: type.id
		},
		include: {
			venue: true,
			type: true
		},
		orderBy: {
			startDate: 'asc'
		}
	});
};
