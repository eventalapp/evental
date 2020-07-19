import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../utils/api';
import { getEvent } from './index';

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

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

		const isAttendeeAlready = await prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				userId: String(user.id)
			}
		});

		if (isAttendeeAlready) {
			throw new NextkitError(401, 'You are already attending this event.');
		}

		const attendeeCount = await prisma.eventAttendee.count({
			where: {
				eventId: event.id
			}
		});

		if (attendeeCount >= event.maxAttendees) {
			throw new NextkitError(
				500,
				'This event is at maximum capacity, the owner has been notified.'
			);

			//TODO: Notify event founder
		}

		const defaultRole = await prisma.eventRole.findFirst({
			where: {
				eventId: event.id,
				defaultRole: true
			}
		});

		if (!defaultRole) {
			throw new NextkitError(404, 'Role not found.');
		}

		const eventAttendee = await prisma.eventAttendee.create({
			data: {
				eventRoleId: defaultRole?.id,
				userId: user.id,
				eventId: event.id,
				permissionRole: 'ATTENDEE'
			}
		});

		if (!eventAttendee) {
			throw new NextkitError(500, 'Could not create attendee.');
		}

		return eventAttendee;
	}
});
