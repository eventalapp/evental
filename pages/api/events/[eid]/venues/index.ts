import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	try {
		let venueList = await prisma.eventVenue.findMany({
			where: { eventId: String(eid) }
		});

		if (venueList.length === 0) {
			return res.status(204).end();
		}

		return res.status(200).send(venueList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
