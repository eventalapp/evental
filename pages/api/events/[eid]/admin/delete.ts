import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../prisma/client';
import { api } from '../../../../../utils/api';
import { isFounder } from '../../../../../utils/isFounder';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isFounder(String(eid), String(user?.id)))) {
			throw new NextkitError(403, 'You must be founder for this event to do this.');
		}

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		await prisma.event.delete({
			where: { id: event.id }
		});
	}
});
