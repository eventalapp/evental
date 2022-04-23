import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		let activityList = await prisma.eventActivity.findMany({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				}
			}
		});

		if (activityList.length === 0) {
			return res.status(204).end();
		}

		return res.status(200).send(activityList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
