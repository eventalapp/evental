import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../utils/api';

export default api({
	async GET({ req }) {
		const { eid, vid } = req.query;

		const venue = await getVenue(String(eid), String(vid));

		if (!venue) {
			throw new NextkitError(404, 'Venue not found');
		}

		return venue;
	}
});

export const getVenue = async (eid: string, vid: string): Promise<Prisma.EventVenue | null> => {
	return await prisma.eventVenue.findFirst({
		where: {
			event: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			},
			OR: [{ id: String(vid) }, { slug: String(vid) }]
		}
	});
};
