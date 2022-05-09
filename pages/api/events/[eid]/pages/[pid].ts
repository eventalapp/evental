import { prisma } from '../../../../../prisma/client';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ req }) {
		const { eid, pid } = req.query;

		const page = await getPage(String(eid), String(pid));

		if (!page) {
			throw new NextkitError(404, 'Page not found');
		}

		return page;
	}
});

export const getPage = async (eid: string, pid: string): Promise<Prisma.EventPage | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const page = await prisma.eventPage.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: String(pid) }, { slug: String(pid) }]
		}
	});

	if (!page) {
		return null;
	}

	return page;
};
