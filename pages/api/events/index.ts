import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';
import { ServerErrorResponse } from '../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event[]>
) => {
	try {
		let events = await getEvents();

		return res.status(200).send(events);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getEvents = async (): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		orderBy: [
			{
				startDate: 'asc'
			}
		]
	});
};
