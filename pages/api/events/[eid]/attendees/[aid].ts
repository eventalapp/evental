import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { getEvent } from '../index';

export type EventAttendeeUser = Prisma.EventAttendee & {
	user: {
		name: string | null;
		image: string | null;
	};
	role: {
		name: string | null;
	};
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	try {
		const { eid, aid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const eventAttendee = await getAttendee(event.id, String(aid));

		if (!eventAttendee) {
			return res.status(404).send({ error: { message: 'Attendee not found.' } });
		}

		return res.status(200).send(eventAttendee);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getAttendee = async (
	eventId: string,
	aid: string
): Promise<EventAttendeeUser | null> => {
	return await prisma.eventAttendee.findFirst({
		where: {
			OR: [{ id: aid }, { slug: aid }],
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
