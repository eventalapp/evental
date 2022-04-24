import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

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

		const activityList = await prisma.eventActivity.findMany({
			where: {
				eventId: event.id
			}
		});

		return res.status(200).send(activityList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
