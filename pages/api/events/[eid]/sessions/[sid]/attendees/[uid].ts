import { NextkitError } from 'nextkit';
import { getEvent } from '../../../index';
import {
	AttendeeWithUser,
	stripAttendeeWithUserPassword
} from '../../../../../../../utils/stripUserPassword';
import { api } from '../../../../../../../utils/api';
import { prisma } from '../../../../../../../prisma/client';
import { getSession } from '../index';

export default api({
	async GET({ req }) {
		const { eid, sid, uid } = req.query;

		const eventSessionAttendee = await getSessionAttendee(String(eid), String(sid), String(uid));

		if (!eventSessionAttendee) {
			throw new NextkitError(404, 'Session attendee not found');
		}

		return eventSessionAttendee;
	}
});

export const getSessionAttendee = async (
	eid: string,
	sid: string,
	uid: string
): Promise<AttendeeWithUser | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	const session = await getSession(eid, sid);

	if (!session) {
		return null;
	}

	const attendee = await prisma.eventAttendee.findFirst({
		where: {
			user: {
				OR: [{ id: uid }, { slug: uid }]
			},
			eventId: event.id
		},
		select: {
			id: true
		}
	});

	if (!attendee) {
		return null;
	}

	const sessionAttendee = await prisma.eventSessionAttendee.findFirst({
		where: {
			eventId: event.id,
			sessionId: session.id,
			attendeeId: attendee.id
		},
		include: {
			attendee: {
				include: {
					user: true,
					role: true
				}
			}
		}
	});

	if (!sessionAttendee) {
		return null;
	}

	return stripAttendeeWithUserPassword(sessionAttendee.attendee);
};
