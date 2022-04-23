import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		let venueList = await prisma.eventVenue.findMany({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				}
			}
		});

		return res.status(200).send(venueList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
