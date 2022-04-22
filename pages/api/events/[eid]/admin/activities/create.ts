import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../prisma/client';
import { CreateActivitySchema } from '../../../../../../utils/schemas';
import { isOrganizer } from '../../../../../../utils/isOrganizer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ message: 'You must be an organizer to do this.' });
	}

	if (req.method === 'POST') {
		try {
			let bodyParsed = CreateActivitySchema.parse(req.body);

			let event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			let createdActivity = await prisma.eventActivity.create({
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

			return res.status(200).send(createdActivity);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);

				return res.status(500).send(error.message);
			}

			return res.status(500).send('An error occurred, please try again.');
		}
	}

	return res.status(204).end();
};
