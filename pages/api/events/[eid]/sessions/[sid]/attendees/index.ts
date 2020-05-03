import { NextkitError } from 'nextkit';
import { getEvent } from '../../../index';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../../../utils/stripUserPassword';
import { api } from '../../../../../../../utils/api';
import { getSession } from '../index';
import { prisma } from '../../../../../../../prisma/client';

export default api({
	async GET({ req }) {
		const { eid, sid } = req.query;

		const attendees = await getSessionAttendees(String(eid), String(sid));

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export const getSessionAttendees = async (
	eid: string,
	sid: string
): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const session = await getSession(eid, sid);

	if (!session) {
		return null;
	}

	const sessionAttendees = await prisma.eventSessionAttendee.findMany({
		where: {
			eventId: event.id,
			sessionId: session.id
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

	return stripAttendeesWithUserPassword(sessionAttendees.map(({ attendee }) => attendee));
};
