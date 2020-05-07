import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';
import { getVenue } from '../venues/[vid]';
import { endOfDay, isAfter, isBefore, parseISO, startOfDay } from 'date-fns';
import { getSessionType } from './types/[tid]';

interface PageOptions {
	page?: number;
}

interface PaginationData {
	total: number;
	pageCount: number;
	currentPage: number;
	perPage: number;
	from: number;
	to: number;
}

export const SESSIONS_PER_PAGE = 20;

export type PaginatedSessionsWithVenue = {
	sessions: SessionWithVenue[];
	pagination: PaginationData;
};

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
	type: Prisma.EventSessionType | null;
} & Prisma.EventSession;

export default api({
	async GET({ req }) {
		const { eid, venue, date, type, page } = req.query;

		const pageParsed = page ? parseInt(String(page)) : 1;

		if (venue) {
			const sessionByVenueList = await getSessionsByVenue(String(eid), String(venue), {
				page: pageParsed
			});

			if (!sessionByVenueList) {
				throw new NextkitError(404, 'Sessions by venue not found');
			}

			return sessionByVenueList;
		}

		if (date) {
			const sessionByDateList = await getSessionsByDate(String(eid), String(date), {
				page: pageParsed
			});

			if (!sessionByDateList) {
				throw new NextkitError(404, 'Sessions by date not found');
			}

			return sessionByDateList;
		}

		if (type) {
			const sessionByTypeList = await getSessionsByType(String(eid), String(type), {
				page: pageParsed
			});

			if (!sessionByTypeList) {
				throw new NextkitError(404, 'Sessions by type not found');
			}

			return sessionByTypeList;
		}

		const sessionList = await getSessions(String(eid), {
			page: pageParsed
		});

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessions = async (
	eid: string,
	args: PageOptions = {}
): Promise<PaginatedSessionsWithVenue | null> => {
	const { page = 1 } = args || {};

	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const count = await prisma.eventSession.count({
		where: {
			eventId: event.id
		},
		orderBy: {
			startDate: 'asc'
		}
	});

	const sessions = await prisma.eventSession.findMany({
		take: SESSIONS_PER_PAGE,
		skip: (page - 1) * SESSIONS_PER_PAGE,
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

	return {
		sessions,
		pagination: {
			total: count,
			pageCount: Math.ceil(count / SESSIONS_PER_PAGE),
			currentPage: page,
			perPage: SESSIONS_PER_PAGE,
			from: (page - 1) * SESSIONS_PER_PAGE + 1,
			to: (page - 1) * SESSIONS_PER_PAGE + sessions.length
		}
	};
};

export const getSessionsByVenue = async (
	eid: string,
	vid: string,
	args: PageOptions = {}
): Promise<SessionWithVenue[] | null> => {
	const { page = 1 } = args || {};

	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const venue = await getVenue(eid, vid);

	if (!venue) {
		return null;
	}

	return await prisma.eventSession.findMany({
		take: 50,
		skip: (page - 1) * 50,
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
	date: string,
	args: PageOptions = {}
): Promise<SessionWithVenue[] | null> => {
	const { page = 1 } = args || {};

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
		take: 50,
		skip: (page - 1) * 50,
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
	tid: string,
	args: PageOptions = {}
): Promise<SessionWithVenue[] | null> => {
	const { page = 1 } = args || {};

	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const type = await getSessionType(eid, tid);

	if (!type) {
		return null;
	}

	return await prisma.eventSession.findMany({
		take: 50,
		skip: (page - 1) * 50,
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
