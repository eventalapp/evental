import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../../prisma/client';
import { ServerError, ServerErrorResponse } from '../../../../../../utils/ServerError';
import { getEvent } from '../../index';
import { handleServerError } from '../../../../../../utils/handleServerError';
import { EventAttendeeUser } from '../[aid]';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	try {
		const { eid, uid } = req.query;

		const eventAttendee = await getAttendeeByUserId(String(eid), String(uid));

		if (!eventAttendee) {
			return res.status(200).end();
		}

		return res.status(200).send(eventAttendee);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getAttendeeByUserId = async (
	eid: string,
	uid: string
): Promise<EventAttendeeUser | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		throw new ServerError('Event not found.', 404);
	}

	const eventAttendee = await prisma.eventAttendee.findFirst({
		where: {
			userId: String(uid),
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
