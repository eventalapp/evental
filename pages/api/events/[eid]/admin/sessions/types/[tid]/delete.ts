import { NextkitError } from 'nextkit';
import { isOrganizer } from '../../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../../utils/api';
import { getEvent } from '../../../../index';
import { prisma } from '../../../../../../../../prisma/client';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, tid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const sessionType = await prisma.eventSessionType.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(tid) }, { slug: String(tid) }]
			},
			select: {
				id: true
			}
		});

		if (!sessionType) {
			throw new NextkitError(404, 'Session not found.');
		}

		await prisma.eventSessionType.delete({
			where: {
				id: sessionType.id
			}
		});
	}
});
