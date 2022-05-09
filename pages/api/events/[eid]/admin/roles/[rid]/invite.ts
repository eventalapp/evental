import { getEvent } from '../../../index';
import { InviteRoleSchema } from '../../../../../../../utils/schemas';
import { ORGANIZER_INVITE_EXPIRY } from '../../../../../../../config';
import { api } from '../../../../../../../utils/api';
import { isFounder } from '../../../../../../../utils/isFounder';
import { NextkitError } from 'nextkit';
import { getRole } from '../../../roles/[rid]';
import { sendRoleInvite } from '../../../../../../../email/sendRoleInvite';

export default api({
	async POST({ ctx, req }) {
		const { eid, rid } = req.query;

		const requestingUser = await ctx.getUser();

		if (!requestingUser) {
			throw new NextkitError(401, 'Unauthorized');
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
			sendToAddress: body.email
		});

		return role;
	}
});
