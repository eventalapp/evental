import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	try {
		let attendeeList = await prisma.eventMember.findMany({
			where: { eventId: String(eid) },
			include: {
				user: {
					select: {
						name: true,
						image: true
					}
				}
			}
		});

		if (attendeeList.length === 0) {
			return res.status(404).send({ message: 'No attendees found.' });
		}

		return res.status(200).send(attendeeList);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
