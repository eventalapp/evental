import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditActivitySchema } from '../../../../../../../utils/schemas';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventActivity>
) => {
	const session = await getSession({ req });
	const { eid, aid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'PUT') {
		try {
			let bodyParsed = EditActivitySchema.parse(req.body);

			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const activity = await prisma.eventActivity.findFirst({
				where: {
					eventId: event.id,
					OR: [{ id: String(aid) }, { slug: String(aid) }]
				},
				select: {
					id: true
				}
			});

			if (!activity) {
				return res.status(404).send({ error: { message: 'Activity not found.' } });
			}

			const editedActivity = await prisma.eventActivity.update({
				where: {
					id: activity.id
				},
				data: {
					eventId: event.id,
					slug: bodyParsed.slug,
					name: bodyParsed.name,
					venueId: bodyParsed.venueId,
					startDate: bodyParsed.startDate,
					endDate: bodyParsed.endDate,
					description: bodyParsed.description
				}
			});

			return res.status(200).send(editedActivity);
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
