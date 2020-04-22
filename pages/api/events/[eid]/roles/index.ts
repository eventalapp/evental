import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		let roleList = await prisma.eventRole.findMany({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				}
			}
		});

		if (roleList.length === 0) {
			return res.status(204).end();
		}

		return res.status(200).send(roleList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
