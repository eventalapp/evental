import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async DELETE({ req, ctx }) {
		const user = await ctx.getUser();
		const { eid, pid } = req.query;

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

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const page = await prisma.eventPage.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(pid) }, { slug: String(pid) }]
			},
			select: {
				id: true
			}
		});

		if (!page) {
			throw new NextkitError(404, 'Page not found.');
		}

		await prisma.eventPage.delete({
			where: {
				id: page.id
			}
		});
	}
});
