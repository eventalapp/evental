import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, rid } = req.query;

	// Get all members of a role

	try {
		let attendee = await prisma.eventMember.findMany({
			where: { eventRoleId: String(rid), eventId: String(eid) },
			include: {
				user: {
					select: {
						name: true,
						image: true,
						company: true,
						position: true
					}
				}
			}
		});

		if (attendee.length === 0) {
			return res.status(204).end();
		}

		return res.status(200).send(attendee);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
