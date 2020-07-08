import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../prisma/client';
import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/attendee';
import { getAttendee } from '../../../attendees/[uid]';

export default api({
	async DELETE({ ctx, req }) {
		const requestingUser = await ctx.getSelfStrippedUser();
		const { eid, uid } = req.query;

		if (!requestingUser?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!requestingUser.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(requestingUser?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const attendee = await getAttendee(event.id, String(uid));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		if (attendee.permissionRole === 'FOUNDER') {
			throw new NextkitError(500, 'You cannot delete the founder.');
		}

		const requestingAttendee = await getAttendee(event.id, String(requestingUser.id));

		if (!requestingAttendee) {
			throw new NextkitError(400, 'You must be attending this event to remove attendees.');
		}

		if (requestingAttendee.id === attendee.id) {
			throw new NextkitError(400, 'You cannot remove yourself, please leave the event.');
		}

		if (
			attendee.permissionRole === 'ORGANIZER' &&
			requestingAttendee.permissionRole === 'ORGANIZER'
		) {
			throw new NextkitError(500, 'You must be the event founder to remove organizers.');
		}

		await prisma.eventAttendee.delete({
			where: {
				id: attendee.id
			}
		});
	}
});
