import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { getAttendee } from '../../../attendees/[uid]';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, uid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
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

		await prisma.eventAttendee.delete({
			where: {
				id: attendee.id
			}
		});
	}
});
