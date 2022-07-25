import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import {
	SessionWithVenueEvent,
	rawToSessionWithVenueEvent,
	sessionWithVenueEventInclude
} from '@eventalapp/shared/utils';

import { api } from '../../../../utils/api';
import { getUser } from './index';

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
