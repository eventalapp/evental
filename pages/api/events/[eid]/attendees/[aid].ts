import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

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

		const eventAttendee = await getAttendee(String(eid), String(aid));

		if (!eventAttendee) {
			return res.status(404).send({ error: { message: 'Attendee not found' } });
		}

		return res.status(200).send(eventAttendee);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getAttendee = async (eid: string, aid: string): Promise<EventAttendeeUser | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	const eventAttendee = await prisma.eventAttendee.findFirst({
		where: {
			OR: [{ id: aid }, { slug: aid }],
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

	if (!eventAttendee) {
		return null;
	}

	return eventAttendee;
};
