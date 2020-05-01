import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const sessionList = await getSessions(String(eid));

		if (!sessionList) {
			throw new NextkitError(404, 'Sessions not found');
		}

		return sessionList;
	}
});

export const getSessions = async (eid: string): Promise<Prisma.EventSession[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	return await prisma.eventSession.findMany({
		where: {
			eventId: event.id
		}
	});
};
