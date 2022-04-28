import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { EventAttendeeUser } from './[aid]';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | EventAttendeeUser[]>
) => {
	const { eid } = req.query;

	try {
		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const attendees = await prisma.eventAttendee.findMany({
			where: {
				eventId: event.id
			},
			include: {
				user: {
					select: {
						name: true,
						image: true
					}
				},
				role: {
					select: {
						name: true
					}
				}
			}
		});

		return res.status(200).send(attendees);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
