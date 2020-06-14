import { getEvent } from '../pages/api/events/[eid]';
import { getAttendee } from '../pages/api/events/[eid]/attendees/[uid]';
import { getSession } from '../pages/api/events/[eid]/sessions/[sid]';
import { prisma } from '../prisma/client';

export type IsSessionAttendeeArguments = {
	eid: string;
	sid: string;
	userId: string;
};

export const isSessionAttendee = async (args: IsSessionAttendeeArguments) => {
	const { eid, sid, userId } = args;

	const event = await getEvent(String(eid));

	if (!event) {
		return false;
	}

	const attendee = await getAttendee(event.id, userId);

	if (!attendee) {
		return false;
	}

	const session = await getSession(event.id, sid);

	if (!session) {
		return false;
	}

	const sessionAttendee = await prisma.eventSessionAttendee.findFirst({
		where: {
			sessionId: session.id,
			attendeeId: attendee.id,
			event: {
				id: event.id
			}
		}
	});

	return Boolean(sessionAttendee);
};
