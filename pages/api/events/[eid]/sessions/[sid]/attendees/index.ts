import { EventSessionAttendeeType } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../prisma/client';
import { api } from '../../../../../../../utils/api';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../../../utils/stripUserPassword';
import { getEvent } from '../../../index';
import { getSession } from '../index';

export default api({
	async GET({ req }) {
		const { eid, sid, type } = req.query;

		const typeParsed =
			EventSessionAttendeeType[String(type) as keyof typeof EventSessionAttendeeType] ??
			EventSessionAttendeeType.ATTENDEE;

		if (!typeParsed) {
			throw new NextkitError(400, 'Invalid attendee type');
		}

		const attendees = await getSessionAttendees(String(eid), String(sid), {
			type: typeParsed
		});

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export interface UseSessionAttendeesOptions {
	type?: EventSessionAttendeeType;
}

export const getSessionAttendees = async (
	eid: string,
	sid: string,
	args: UseSessionAttendeesOptions = {}
): Promise<AttendeeWithUser[] | null> => {
	const { type = EventSessionAttendeeType.ATTENDEE } = args;

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
			sessionId: session.id,
			type
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
