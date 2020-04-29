import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
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

		if (roles && roles.length === 0) {
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

		if (!roles) {
			return res.status(404).send({ error: { message: 'Roles not found' } });
		}

		return res.status(200).send(roles);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getRoles = async (eid: string): Promise<Prisma.EventRole[] | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	return await prisma.eventRole.findMany({
		where: {
			eventId: event.id
		}
	});
};
