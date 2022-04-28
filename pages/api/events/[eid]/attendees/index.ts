import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { EventAttendeeUser } from './[aid]';
import { getEvent } from '../index';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | EventAttendeeUser[]>
) => {
	try {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const attendees = await getAttendees(event.id);

		return res.status(200).send(attendees);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getAttendees = async (eventId: string): Promise<EventAttendeeUser[]> => {
	return await prisma.eventAttendee.findMany({
		where: {
			eventId: eventId
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
};
