import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import {
	SessionWithVenue,
	rawToSessionWithVenue,
	sessionWithVenueInclude
} from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ req }) {
		const { eid, sid } = req.query;

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		return session;
	}
});

export const getSession = async (eid: string, sid: string): Promise<SessionWithVenue | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const session = await prisma.eventSession.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: sid }, { slug: sid }]
		},
		include: sessionWithVenueInclude
	});

	if (!session) {
		return null;
	}

	return rawToSessionWithVenue(session);
};
