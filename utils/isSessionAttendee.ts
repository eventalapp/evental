import { getEvent } from '../pages/api/events/[eid]';
import { getAttendee } from '../pages/api/events/[eid]/attendees/[uid]';
import { prisma } from '../prisma/client';

export const isSessionAttendee = async (userId: string, eventId: string, sessionId: string) => {
	const event = await getEvent(String(eventId));

	if (!event) {
		return false;
	}

	const attendee = await getAttendee(event.id, userId);

	if (!attendee) {
		return false;
	}

	const sessionAttendee = await prisma.eventSessionAttendee.findFirst({
		where: {
			sessionId: sessionId,
			attendeeId: attendee.id,
			event: {
				id: event.id
			}
		}
	});

	if (!sessionAttendee) {
		return false;
	}

	return Boolean(sessionAttendee);
};
