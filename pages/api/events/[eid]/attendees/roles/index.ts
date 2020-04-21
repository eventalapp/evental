import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid } = req.query;

	// Get all roles for the event

	try {
		let roles = await prisma.eventRole.findMany();

		// If no roles exist, crate a default role

		if (roles.length === 0) {
			let role = prisma.eventRole.create({
				data: {
					role: 'ATTENDEE',
					eventId: String(eid)
				}
			});

			return res.status(200).send({ roles: [role] });
		}

		return res.status(200).send({ roles });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
