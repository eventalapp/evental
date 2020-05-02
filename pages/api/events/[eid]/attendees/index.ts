import { prisma } from '../../../../../prisma/client';

import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../utils/stripUserPassword';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const attendees = await getAttendees(String(eid));

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export const getAttendees = async (eid: string): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const attendees = await prisma.eventAttendee.findMany({
		where: {
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	return stripAttendeesWithUserPassword(attendees);
};
