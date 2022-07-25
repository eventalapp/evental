import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { AttendeeWithUser, stripAttendeeWithUser } from '@eventalapp/shared/utils';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid, uid } = req.query;

		const eventAttendee = await getAttendee(String(eid), String(uid));

		if (!eventAttendee) {
			throw new NextkitError(404, 'Attendee not found');
		}

		return eventAttendee;
	},
	async DELETE({ req }) {
		const { eid, uid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const attendee = await getAttendee(event.id, String(uid));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		if (attendee.permissionRole === 'FOUNDER') {
			throw new NextkitError(
				403,
				'You cannot leave the event as the founder. If you wish to delete the event, go to the event settings'
			);
		}

		await prisma.eventAttendee.delete({
			where: {
				id: attendee.id
			}
		});
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

	return stripAttendeeWithUser(eventAttendee);
};
