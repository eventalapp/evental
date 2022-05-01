import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, sid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
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

		const session = await prisma.eventSession.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(sid) }, { slug: String(sid) }]
			},
			select: {
				id: true
			}
		});

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		await prisma.eventSession.delete({
			where: {
				id: session.id
			}
		});
	}
});
