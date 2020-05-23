import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../prisma/client';
import { api } from '../../../../../utils/api';
import {
	AttendeeWithUser,
	stripAttendeeWithUserPassword
} from '../../../../../utils/stripUserPassword';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid, uid } = req.query;

		const eventAttendee = await getAttendee(String(eid), String(uid));

		if (!eventAttendee) {
			throw new NextkitError(404, 'Attendee not found');
		}

		return eventAttendee;
	}
});

export const getAttendee = async (eid: string, uid: string): Promise<AttendeeWithUser | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	const eventAttendee = await prisma.eventAttendee.findFirst({
		where: {
			user: {
				OR: [{ id: uid }, { slug: uid }]
			},
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	if (!eventAttendee) {
		return null;
	}

	return stripAttendeeWithUserPassword(eventAttendee);
};
