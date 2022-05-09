import { ChangePasswordRequestSchema } from '../../../../../utils/schemas';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { ORGANIZER_INVITE_EXPIRY } from '../../../../../config';
import { prisma } from '../../../../../prisma/client';
import { isFounder } from '../../../../../utils/isFounder';
import { sendOrganizerInvite } from '../../../../../email/sendOrganizerInvite';

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

		const body = ChangePasswordRequestSchema.parse(req.body);

		const user = await prisma.user.findFirst({
			where: {
				email: body.email
			}
		});

		if (!user) {
			throw new NextkitError(404, 'User not found');
		}

		const isFounderResponse = await isFounder(String(eid), user.id);

		if (!isFounderResponse) {
			throw new NextkitError(403, 'You must be a founder to invite organizers');
		}

		const inviteCode = await ctx.getOrganizerInviteCode();

		await ctx.redis.set(`organizer:${inviteCode}`, body.email, { ex: ORGANIZER_INVITE_EXPIRY });

		await sendOrganizerInvite(user.email, inviteCode);
	}
});
