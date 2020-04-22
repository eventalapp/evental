import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, vid } = req.query;

	try {
		let venue = await prisma.eventVenue.findFirst({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				},
				OR: [{ id: String(vid) }, { slug: String(vid) }]
			}
		});

		if (!venue) {
			return res.status(404).send({ error: { message: 'Venue not found.' } });
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
