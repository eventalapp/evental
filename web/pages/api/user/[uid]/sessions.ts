import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { stripAttendeeWithUser } from '../../../../utils/user';
import {
	SessionWithVenue,
	SessionWithVenueRaw,
	sessionWithVenueInclude
} from '../../events/[eid]/sessions';
import { SessionCategoryWithCount } from '../../events/[eid]/sessions/categories';
import { getUser } from './index';

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

export default api({
	async GET({ req }) {
		const { uid } = req.query;

		const sessionList = await getSessionsByUser(String(uid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessionsByUser = async (uid: string): Promise<SessionWithVenueEvent[] | null> => {
	const user = await getUser(uid);

	if (!user) {
		return null;
	}

	const sessions = await prisma.eventSession.findMany({
		where: {
			attendees: {
				some: {
					attendee: {
						user: {
							id: user.id
						}
					}
				}
			}
		},
		include: sessionWithVenueEventInclude,
		orderBy: {
			startDate: 'asc'
		}
	});

	return sessions.map(rawToSessionWithVenueEvent);
};
