import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerError, ServerErrorResponse } from '../../../../../utils/ServerError';
import { EventAttendeeUser } from './[aid]';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | EventAttendeeUser[]>
) => {
	try {
		const { eid } = req.query;

		const attendees = await getAttendees(String(eid));

		return res.status(200).send(attendees);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getAttendees = async (eid: string): Promise<EventAttendeeUser[]> => {
	const event = await getEvent(eid);

	if (!event) {
		throw new ServerError('Event not found.', 404);
	}

	return await prisma.eventAttendee.findMany({
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
};
