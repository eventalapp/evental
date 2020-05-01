import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

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

export const getSession = async (eid: string, sid: string): Promise<Prisma.EventSession | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const session = await prisma.eventSession.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: sid }, { slug: sid }]
		}
	});

	if (!session) {
		return null;
	}

	return session;
};
