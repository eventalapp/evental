import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | string>) => {
	const session = await getSession({ req });
	const { eid, aid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'DELETE') {
		try {
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

			await prisma.eventActivity.delete({
				where: {
					id: activity.id
				}
			});

			return res.status(200).send('Activity deleted.');
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);

				return res.status(500).send({ error: { message: error.message } });
			}

			return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
		}
	}

	return res.status(204).end();
};
