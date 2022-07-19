import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';
import { getDefaultRole } from '../../roles';
import { getSession } from './index';

export default api({
	async POST({ ctx, req }) {
		const { eid, sid } = req.query;

		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const session = await getSession(String(eid), String(sid));

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		const attendeeCount = await prisma.eventSessionAttendee.count({
			where: {
				sessionId: String(session.id),
				eventId: event.id
			}
		});

		if (session.maxAttendees !== null && attendeeCount >= session.maxAttendees) {
			throw new NextkitError(403, 'This session is full. Please select another session.');
		}

		let attendee = await prisma.eventAttendee.findFirst({
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

			attendee = await prisma.eventAttendee.create({
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
