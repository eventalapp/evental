import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventVenue>
) => {
	try {
		const { eid, vid } = req.query;

		const venue = await getVenue(String(eid), String(vid));

		if (!venue) {
			return res.status(404).send({ error: { message: 'Venue not found' } });
		}

		return res.status(200).send(venue);
	} catch (error) {
		return handleServerError(error, res);
	}
};

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
