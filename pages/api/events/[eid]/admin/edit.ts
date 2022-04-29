import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../prisma/client';
import { isOrganizer } from '../../../../../utils/isOrganizer';
import { EditEventSchema } from '../../../../../utils/schemas';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.Event>
) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'PUT') {
		try {
			const parsed = EditEventSchema.parse(req.body);

			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const updatedEvent = await prisma.event.update({
				data: {
					name: parsed.name,
					description: parsed.description,
					location: parsed.location,
					startDate: parsed.startDate,
					endDate: parsed.endDate,
					image: parsed.image,
					slug: parsed.slug
				},
				where: {
					id: event.id
				}
			});

			return res.status(200).send(updatedEvent);
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
