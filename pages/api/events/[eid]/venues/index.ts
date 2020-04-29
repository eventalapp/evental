import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventVenue[]>
) => {
	try {
		const { eid } = req.query;

		const venueList = await getVenues(String(eid));

		return res.status(200).send(venueList);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getVenues = async (eid: string): Promise<Prisma.EventVenue[]> => {
	return await prisma.eventVenue.findMany({
		where: {
			event: {
				OR: [{ id: eid }, { slug: eid }]
			}
		}
	});
};
