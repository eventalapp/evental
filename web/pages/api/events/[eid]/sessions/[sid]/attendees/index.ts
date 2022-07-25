import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import {
	AttendeeWithUser,
	attendeeWithUserInclude,
	stripAttendeesWithUser
} from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { getEvent } from '../../../index';
import { getSession } from '../index';

export default api({
	async GET({ req }) {
		const { eid, sid, type } = req.query;

		const typeParsed =
			Prisma.EventSessionAttendeeType[
				String(type) as keyof typeof Prisma.EventSessionAttendeeType
			] ?? Prisma.EventSessionAttendeeType.ATTENDEE;

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
	type?: Prisma.EventSessionAttendeeType;
}

export const getSessionAttendees = async (
	eid: string,
	sid: string,
	args: UseSessionAttendeesOptions = {}
): Promise<AttendeeWithUser[] | null> => {
	const { type = Prisma.EventSessionAttendeeType.ATTENDEE } = args;

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
		include: attendeeWithUserInclude
	});

	return stripAttendeesWithUser(sessionAttendees.map(({ attendee }) => attendee));
};
