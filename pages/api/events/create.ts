import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../prisma/client';
import { CreateEventSchema } from '../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	if (req.method === 'POST') {
		try {
			let bodyParsed = CreateEventSchema.parse(req.body);

			let createdEvent = await prisma.event.create({
				data: {
					slug: bodyParsed.slug,
					name: bodyParsed.name,
					location: bodyParsed.location,
					startDate: bodyParsed.startDate,
					endDate: bodyParsed.endDate,
					description: bodyParsed.description
				}
			});

			let attendeeRole = await prisma.eventRole.create({
				data: {
					name: 'ATTENDEE',
					slug: 'attendee',
					eventId: String(createdEvent.id)
				}
			});

			await prisma.eventMember.create({
				data: {
					eventId: createdEvent.id,
					permissionRole: 'FOUNDER',
					userId: session.user.id,
					eventRoleId: String(attendeeRole.id)
				}
			});

			return res.status(200).send(createdEvent);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				return res.status(500).send(error.message);
			}

			return res.status(500).send('An error occurred, please try again.');
		}
	}
};
