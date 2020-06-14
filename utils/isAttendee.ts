import { getEvent } from '../pages/api/events/[eid]';
import { prisma } from '../prisma/client';

export const isAttendee = async (userId: string, eventId: string) => {
	const event = await getEvent(String(eventId));

	if (!event) {
		return false;
	}

	const attendee = await prisma.eventAttendee.findFirst({
		where: {
			userId: userId,
			event: {
				id: event.id
			}
		}
	});

	if (!attendee) {
		return false;
	}

	return Boolean(attendee);
};
