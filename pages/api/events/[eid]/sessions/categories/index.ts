import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const sessionCategoryList = await getSessionCategories(String(eid));

		if (!sessionCategoryList) {
			throw new NextkitError(404, 'Session Categories not found');
		}

		return sessionCategoryList;
	}
});

export const getSessionCategories = async (
	eid: string
): Promise<Prisma.EventSessionCategory[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	return await prisma.eventSessionCategory.findMany({
		where: {
			eventId: event.id
		}
	});
};
