import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { SessionCategoryWithCount, rawToSessionCategoryWithCount } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ req }) {
		const { eid, cid } = req.query;

		const sessionCategory = await getSessionCategory(String(eid), String(cid));

		if (!sessionCategory) {
			throw new NextkitError(404, 'Session category not found.');
		}

		return sessionCategory;
	}
});

export const getSessionCategory = async (
	eid: string,
	cid: string
): Promise<SessionCategoryWithCount | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const sessionCategory = await prisma.eventSessionCategory.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: cid }, { slug: cid }]
		},
		include: {
			_count: {
				select: { sessions: true }
			}
		}
	});

	if (!sessionCategory) {
		return null;
	}

	return rawToSessionCategoryWithCount(sessionCategory);
};
