import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/client';
import { ServerErrorResponse } from '../../../../utils/ServerError';
import type Prisma from '@prisma/client';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event>
) => {
	const { eid } = req.query;

	try {
		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] }
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Venue not found.' } });
		}

		return res.status(200).send(event);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
