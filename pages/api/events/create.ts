import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../prisma/client';
import { CreateEventSchema } from '../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (req.method === 'POST') {
		try {
			const parsed = CreateEventSchema.parse(req.body);

			const event = await prisma.event.create({
				data: {
					slug: parsed.slug,
					name: parsed.name,
					location: parsed.location,
					startDate: parsed.startDate,
					endDate: parsed.endDate,
					description: parsed.description
				}
			});

			const attendeeRole = await prisma.eventRole.create({
				data: {
					name: 'ATTENDEE',
					slug: 'attendee',
					eventId: String(event.id)
				}
			});

			await prisma.eventMember.create({
				data: {
					slug: String('founder-slug'),
					eventId: event.id,
					permissionRole: 'FOUNDER',
					userId: session.user.id,
					eventRoleId: String(attendeeRole.id)
				}
			});

			return res.status(200).send(event);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
				return res.status(500).send({ error: { message: error.message } });
			}

			return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
		}
	}
};
