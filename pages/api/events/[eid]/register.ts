import { prisma } from '../../../../prisma/client';
import { getEvent } from './index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../utils/api';

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

		const user = await ctx.getUser();

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
