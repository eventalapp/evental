import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			},
			select: {
				id: true
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const roles = await prisma.eventRole.findMany({
			where: {
				eventId: event.id
			}
		});

		// If no roles exist, crate a default role

		if (roles.length === 0) {
			const role = prisma.eventRole.create({
				data: {
					name: 'ATTENDEE',
					slug: 'attendee',
					eventId: String(eid)
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
