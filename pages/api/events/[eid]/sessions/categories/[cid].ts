import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ req }) {
		const { eid, cid } = req.query;

		const sessionCategory = await getSessionCategory(String(eid), String(cid));

		if (!sessionCategory) {
			throw new NextkitError(404, 'Session Type not found.');
		}

		return sessionCategory;
	}
});

export const getSessionCategory = async (
	eid: string,
	cid: string
): Promise<Prisma.EventSessionCategory | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessionCategory = await prisma.eventSessionCategory.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: cid }, { slug: cid }]
		}
	});

	if (!sessionCategory) {
		return null;
	}

	return sessionCategory;
};
