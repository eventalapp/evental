import { ChangePasswordRequestSchema } from '../../../../../../utils/schemas';
import { api } from '../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { ORGANIZER_INVITE_EXPIRY } from '../../../../../../config';
import { isFounder } from '../../../../../../utils/isFounder';
import { sendOrganizerInvite } from '../../../../../../email/sendOrganizerInvite';
import { prisma } from '../../../../../../prisma/client';
import { getEvent } from '../../index';

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

		const requestingUser = await ctx.getUser();

		if (!requestingUser) {
			throw new NextkitError(401, 'Unauthorized');
		}

		const isFounderResponse = await isFounder(String(eid), String(requestingUser?.id));

		if (!isFounderResponse) {
			throw new NextkitError(403, 'You must be a founder to invite organizers');
		}

		const body = ChangePasswordRequestSchema.parse(req.body);

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

		await sendOrganizerInvite(body.email, inviteCode, event, requestingUser.name);
	}
});
