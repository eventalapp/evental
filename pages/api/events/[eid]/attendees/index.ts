import { prisma } from '../../../../../prisma/client';
import { EventAttendeeUser } from './[aid]';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const attendees = await getAttendees(String(eid));

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export const getAttendees = async (eid: string): Promise<EventAttendeeUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
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
