import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, aid } = req.query;

	try {
		let activity = await prisma.eventActivity.findFirst({
			where: { eventId: String(eid), id: String(aid) }
		});

		if (!activity) {
			return res.status(404).send({ message: 'Activity not found.' });
		}

		return res.status(200).send(activity);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
