import Prisma from '@eventalapp/shared/db';
import { prisma } from '@eventalapp/shared/db/client';
import { NextkitError } from 'nextkit';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

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
