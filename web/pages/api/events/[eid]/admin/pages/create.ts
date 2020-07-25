import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { CreatePageSchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { isOrganizer } from '../../../../../../utils/attendee';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
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

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const body = CreatePageSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const slug = await generateSlug(body.name, async (val) => {
			return !Boolean(
				await prisma.eventPage.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		const createdPage = await prisma.eventPage.create({
			data: {
				eventId: event.id,
				name: body.name,
				slug: slug,
				body: body.body,
				topLevel: body.topLevel
			}
		});

		if (!createdPage) {
			throw new NextkitError(500, 'Failed to create page.');
		}

		return createdPage;
	}
});
