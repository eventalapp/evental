import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, rid } = req.query;

	try {
		let role = await prisma.eventRole.findFirst({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				},
				id: String(rid)
			}
		});

		if (!role) {
			return res.status(404).send({ message: 'Role not found.' });
		}

		return res.status(200).send(role);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
