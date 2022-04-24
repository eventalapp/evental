import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../prisma/client';
import { isOrganizer } from '../../../../../utils/isOrganizer';
import { EditEventSchema } from '../../../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
			const bodyParsed = EditEventSchema.parse(req.body);

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
					name: bodyParsed.name,
					description: bodyParsed.description,
					location: bodyParsed.location,
					startDate: bodyParsed.startDate,
					endDate: bodyParsed.endDate
				},
				where: {
					id: event.id
				}
			});

			return res.status(200).send(updatedEvent);
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
