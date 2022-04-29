import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import { handleServerError } from '../../../../../../../utils/handleServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | string>) => {
	const session = await getSession({ req });
	const { eid, vid } = req.query;

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

			const venue = await prisma.eventVenue.findFirst({
				where: {
					eventId: event.id,
					OR: [{ id: String(vid) }, { slug: String(vid) }]
				},
				select: {
					id: true
				}
			});

			if (!venue) {
				return res.status(404).send({ error: { message: 'Venue not found.' } });
			}

			await prisma.eventVenue.delete({
				where: {
					id: venue.id
				}
			});

			return res.status(200).send('Venue deleted.');
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
