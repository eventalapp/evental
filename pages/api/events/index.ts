import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';
import { ServerErrorResponse } from '../../../utils/ServerError';
import Prisma from '@prisma/client';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event[]>
) => {
	try {
		let events = await prisma.event.findMany();

		return res.status(200).send(events);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
