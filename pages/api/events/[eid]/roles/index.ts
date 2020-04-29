import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerError, ServerErrorResponse } from '../../../../../utils/ServerError';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventRole[]>
) => {
	try {
		const { eid } = req.query;

		const roles = await getRoles(String(eid));

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
		return handleServerError(error, res);
	}
};

export const getRoles = async (eid: string): Promise<Prisma.EventRole[]> => {
	const event = await getEvent(String(eid));

	if (!event) {
		throw new ServerError('Event not found.');
	}

	return await prisma.eventRole.findMany({
		where: {
			eventId: event.id
		}
	});
};
