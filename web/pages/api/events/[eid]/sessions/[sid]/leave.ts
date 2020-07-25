import { NextkitError } from 'nextkit';

import { getSession } from '.';
import { getEvent } from '../..';
import { api } from '../../../../../../utils/api';
import { getAttendee } from '../../attendees/[uid]';

export default api({
	async DELETE({ ctx, req }) {
		const { eid, sid } = req.query;

		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		const attendee = await getAttendee(event.id, String(user.slug));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		await ctx.prisma.eventSessionAttendee.delete({
			where: {
				eventId_sessionId_attendeeId: {
					eventId: event.id,
					sessionId: session.id,
					attendeeId: attendee.id
				}
			}
		});

		return user;
	}
});
