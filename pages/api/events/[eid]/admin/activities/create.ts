import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateActivitySchema } from '../../../../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	if (!isOrganizer(String(session?.user?.id), String(eid))) {
		return res.status(401).send({ message: 'You must be an organizer to do this.' });
	}

	if (req.method === 'POST') {
		try {
			console.log(req.body);

			let bodyParsed = CreateActivitySchema.parse(req.body);

			let createdActivity = await prisma.eventActivity.create({
				data: {
					eventId: String(eid),
					name: bodyParsed.name,
					venueId: bodyParsed.venueId,
					startDate: bodyParsed.startDate,
					endDate: bodyParsed.endDate,
					description: bodyParsed.description
				}
			});

			return res.status(200).send(createdActivity);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				console.error(error.message);
				return res.status(500).send(error.message);
			}

			return res.status(500).send('An error occurred, please try again.');
		}
	}

	return res.status(204).end();
};
