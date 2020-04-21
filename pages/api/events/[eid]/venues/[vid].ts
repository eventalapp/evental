import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid, vid } = req.query;

	try {
		let venue = await prisma.eventVenue.findFirst({
			where: { eventId: String(eid), id: String(vid) }
		});

		if (!venue) {
			return res.status(404).send({ message: 'Venue not found.' });
		}

		return res.status(200).send(venue);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
