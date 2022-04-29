import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateVenueSchema } from '../../../../../../utils/schemas';
import { ServerErrorResponse } from '../../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../../utils/handleServerError';
import { processSlug } from '../../../../../../utils/slugify';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventVenue>
) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'POST') {
		try {
			const parsed = CreateVenueSchema.parse(req.body);

			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const createdActivity = await prisma.eventVenue.create({
				data: {
					eventId: event.id,
					slug: processSlug(parsed.slug),
					name: parsed.name,
					description: parsed.description
				}
			});

			return res.status(200).send(createdActivity);
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
