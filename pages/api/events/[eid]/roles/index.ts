import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventRole[]>
) => {
	try {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const roles = await getRoles(event.id);

		if (roles.length === 0) {
			const role = await prisma.eventRole.create({
				data: {
					name: 'ATTENDEE',
					slug: 'attendee',
					eventId: String(eid),
					defaultRole: true
				}
			});

			return res.status(200).send([role]);
		}

		return res.status(200).send(roles);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getRoles = async (eventId: string): Promise<Prisma.EventRole[]> => {
	return await prisma.eventRole.findMany({
		where: {
			eventId: eventId
		}
	});
};
