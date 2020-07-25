import { NextkitError } from 'nextkit';

import { getEvent } from '.';
import { api } from '../../../../utils/api';
import { getAttendee } from './attendees/[uid]';

export default api({
	async DELETE({ req, ctx }) {
		const { eid } = req.query;

		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const attendee = await getAttendee(event.id, String(user.slug));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		if (attendee.permissionRole === 'FOUNDER') {
			throw new NextkitError(
				403,
				'You cannot leave the event as the founder. If you wish to delete the event, go to the event settings'
			);
		}

		await ctx.prisma.eventAttendee.delete({
			where: {
				id: attendee.id
			}
		});
	}
});
