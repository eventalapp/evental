import { prisma } from '../../../../../prisma/client';
import { isFounder } from '../../../../../utils/isFounder';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
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
