import isISODate from 'is-iso-date';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { z } from 'zod';
import prisma from '../../../prisma/client';

const CreateEventSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	location: z.string().min(1, 'Location must be specified').max(100, 'Location is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

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
					name: bodyParsed.name,
					location: bodyParsed.location,
					startDate: bodyParsed.startDate,
					endDate: bodyParsed.endDate,
					description: bodyParsed.description
				}
			});

			await prisma.eventMember.create({
				data: {
					eventId: createdEvent.id,
					permissionRole: 'FOUNDER',
					userId: session.user.id
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
