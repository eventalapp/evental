import { NextkitError } from 'nextkit';

import { InviteRoleSchema } from '@eventalapp/shared/utils';
import { ORGANIZER_INVITE_EXPIRY } from '@eventalapp/shared/utils/config';

import { sendRoleInvite } from '../../../../../../../email/templates/inviteRole';
import { api } from '../../../../../../../utils/api';
import { isFounder } from '../../../../../../../utils/attendee';
import { getEvent } from '../../../index';
import { getRole } from '../../../roles/[rid]';

export default api({
	async POST({ ctx, req }) {
		const { eid, rid } = req.query;

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

		const body = InviteRoleSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		const role = await getRole(String(eid), String(rid));

		if (!role) {
			throw new NextkitError(404, 'Role not found');
		}

		const inviteCode = await ctx.getRoleInviteCode();

		await ctx.redis.set(`role:${inviteCode}`, `${event.id}:${role.id}:${body.email}`, {
			ex: ORGANIZER_INVITE_EXPIRY
		});

		await sendRoleInvite({
			role,
			event,
			inviterName: requestingUser.name,
			inviteCode,
			toAddresses: [body.email]
		});

		return role;
	}
});
