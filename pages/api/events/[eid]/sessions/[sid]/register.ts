import { NextkitError } from 'nextkit';
import { getEvent } from '../../index';
import { api } from '../../../../../../utils/api';
import { prisma } from '../../../../../../prisma/client';
import { getSession } from './index';
import { getDefaultRole } from '../../roles';

export default api({
	async POST({ ctx, req }) {
		const { eid, sid } = req.query;

		const user = await ctx.getUser();

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

		const attendee = await prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				userId: String(user.id)
			}
		});

		if (!attendee) {
			const defaultRole = await getDefaultRole(String(event.id));

			if (!defaultRole) {
				throw new NextkitError(404, 'Default role not found.');
			}

			await prisma.eventAttendee.create({
				data: {
					eventId: event.id,
					userId: String(user.id),
					permissionRole: 'ATTENDEE',
					eventRoleId: defaultRole.id
				}
			});
		}

		if (!attendee) {
			throw new NextkitError(404, 'You must be attending this event to attend this session.');
		}

		const isSessionAttendeeAlready = await prisma.eventSessionAttendee.findFirst({
			where: {
				eventId: event.id,
				attendeeId: String(attendee.id),
				sessionId: String(session.id)
			}
		});

		if (isSessionAttendeeAlready) {
			throw new NextkitError(401, 'You are already attending this session.');
		}

		const eventSessionAttendee = await prisma.eventSessionAttendee.create({
			data: {
				attendeeId: attendee.id,
				sessionId: String(session.id),
				eventId: event.id
			}
		});

		if (!eventSessionAttendee) {
			throw new NextkitError(500, 'Could not create session attendee.');
		}

		return eventSessionAttendee;
	}
});
