import { prisma } from '@eventalapp/shared/db/client';

import { getEvent } from '../pages/api/events/[eid]';
import { getAttendee } from '../pages/api/events/[eid]/attendees/[uid]';
import { getSession } from '../pages/api/events/[eid]/sessions/[sid]';

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

export const isFounder = async (eid: string, userId: string) => {
	return Boolean(
		await prisma.eventAttendee.findFirst({
			where: {
				userId: userId,
				event: {
					OR: [{ id: eid }, { slug: eid }]
				},
				permissionRole: 'FOUNDER'
			}
		})
	);
};

export const isOrganizer = async (userId: string, eventId: string) => {
	const event = await getEvent(String(eventId));

	if (!event) {
		return false;
	}

	const attendee = await prisma.eventAttendee.findFirst({
		where: {
			userId: userId,
			event: {
				id: event.id
			},
			OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
		}
	});

	if (!attendee) {
		return false;
	}

	return Boolean(attendee);
};

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
			eventId: event.id
		}
	});

	return Boolean(sessionAttendee);
};
