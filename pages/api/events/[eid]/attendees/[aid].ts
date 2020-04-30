import type Prisma from '@prisma/client';
import { prisma } from '../../../../../prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export type EventAttendeeUser = Prisma.EventAttendee & {
	user: {
		name: string | null;
		image: string | null;
	};
	role: {
		name: string | null;
	};
};

export default api({
	async POST({ req }) {
		const { eid, aid } = req.query;

		const eventAttendee = await getAttendee(String(eid), String(aid));

		if (!eventAttendee) {
			throw new NextkitError(404, 'Attendee not found');
		}

		return eventAttendee;
	}
});

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
