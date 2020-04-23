import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	try {
		let roles = await prisma.eventRole.findMany({
			where: {
				event: {
					OR: [{ id: String(eid) }, { slug: String(eid) }]
				}
			}
		});

		// If no roles exist, crate a default role

		if (roles.length === 0) {
			let role = prisma.eventRole.create({
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
