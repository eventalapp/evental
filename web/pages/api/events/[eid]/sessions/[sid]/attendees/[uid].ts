import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import {
	AttendeeWithUser,
	attendeeWithUserInclude,
	stripAttendeeWithUser
} from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { getAttendee } from '../../../attendees/[uid]';
import { getEvent } from '../../../index';
import { getSession } from '../index';

export default api({
	async GET({ req }) {
		const { eid, sid, uid } = req.query;

		const eventSessionAttendee = await getSessionAttendee(String(eid), String(sid), String(uid));

		if (!eventSessionAttendee) {
			throw new NextkitError(404, 'Session attendee not found');
		}

		return eventSessionAttendee;
	},
	async DELETE({ req }) {
		const { eid, uid, sid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		const attendee = await getAttendee(event.id, String(uid));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		await prisma.eventSessionAttendee.delete({
			where: {
				eventId_sessionId_attendeeId: {
					eventId: event.id,
					sessionId: session.id,
					attendeeId: attendee.id
				}
			}
		});
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
		include: attendeeWithUserInclude
	});

	if (!sessionAttendee) {
		return null;
	}

	return stripAttendeeWithUser(sessionAttendee.attendee);
};
