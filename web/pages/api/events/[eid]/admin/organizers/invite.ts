import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { InviteOrganizerSchema, ORGANIZER_INVITE_EXPIRY } from '@eventalapp/shared/utils';

import { sendOrganizerInvite } from '../../../../../../email/templates/inviteOrganizer';
import { api } from '../../../../../../utils/api';
import { isFounder } from '../../../../../../utils/attendee';
import { getEvent } from '../../index';

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

		const requestingUser = await ctx.getSelfStrippedUser();

		if (!requestingUser) {
			throw new NextkitError(401, 'Unauthorized');
		}

		if (!requestingUser.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const isFounderResponse = await isFounder(String(eid), String(requestingUser?.id));

		if (!isFounderResponse) {
			throw new NextkitError(403, 'You must be a founder to invite organizers');
		}

		const body = InviteOrganizerSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		const attendee = await prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				user: {
					email: body.email
				}
			}
		});

		if (attendee) {
			if (attendee.permissionRole === 'ORGANIZER' || attendee.permissionRole === 'FOUNDER') {
				throw new NextkitError(400, 'You are already an organizer');
			}
		}

		const inviteCode = await ctx.getOrganizerInviteCode();

		await ctx.redis.set(`organizer:${inviteCode}`, `${event.id}:${body.email}`, {
			ex: ORGANIZER_INVITE_EXPIRY
		});

		await sendOrganizerInvite({
			toAddresses: [body.email],
			inviteCode,
			event,
			inviterName: requestingUser.name
		});
	}
});
