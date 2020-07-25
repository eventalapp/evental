import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import {
	SessionCategoryWithCount,
	rawToSessionCategoryWithCount,
	sessionCategoryWithCountInclude
} from '@eventalapp/shared/utils/session';

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
): Promise<SessionCategoryWithCount[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessionCategories = await prisma.eventSessionCategory.findMany({
		where: {
			eventId: event.id
		},
		include: sessionCategoryWithCountInclude
	});

	return sessionCategories.map(rawToSessionCategoryWithCount);
};
