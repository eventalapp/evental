import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';
import { getEvent } from '../../index';
import { api } from '../../../../../../utils/api';
import { prisma } from '../../../../../../prisma/client';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const sessionTypeList = await getSessionTypes(String(eid));

		if (!sessionTypeList) {
			throw new NextkitError(404, 'Session types not found');
		}

		return sessionTypeList;
	}
});

export const getSessionTypes = async (eid: string): Promise<Prisma.EventSessionType[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	return await prisma.eventSessionType.findMany({
		where: {
			eventId: event.id
		}
	});
};
