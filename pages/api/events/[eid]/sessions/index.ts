import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';
import { getVenue } from '../venues/[vid]';

export type SessionWithVenue = {
	venue: Prisma.EventVenue | null;
} & Prisma.EventSession;

export default api({
	async GET({ req }) {
		const { eid, venue } = req.query;

		if (venue) {
			const sessionByVenueList = getSessionsByVenue(String(eid), String(venue));

			if (!sessionByVenueList) {
				throw new NextkitError(404, 'Sessions by venue not found');
			}

			return sessionByVenueList;
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
			venue: true
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
	const venue = await getVenue(eid, vid);

	if (!event) {
		return null;
	}

	if (!venue) {
		return null;
	}

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id,
			venueId: venue.id
		},
		include: {
			venue: true
		},
		orderBy: {
			startDate: 'asc'
		}
	});
};
