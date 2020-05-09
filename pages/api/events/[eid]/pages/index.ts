import { prisma } from '../../../../../prisma/client';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const pages = await getPages(String(eid));

		if (!pages) {
			throw new NextkitError(404, 'Pages not found');
		}

		return pages;
	}
});

export const getPages = async (eid: string): Promise<Prisma.EventPage[] | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	return await prisma.eventPage.findMany({
		where: {
			eventId: event.id
		}
	});
};
