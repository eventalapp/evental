import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditPageSchema } from '../../../../../../../utils/schemas';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { generateSlug } from '../../../../../../../utils/generateSlug';

export default api({
	async PUT({ ctx, req }) {
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

		const parsed = EditPageSchema.parse(req.body);

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
				id: true,
				name: true
			}
		});

		if (!page) {
			throw new NextkitError(404, 'Page not found.');
		}

		const slug =
			parsed.name !== page.name
				? await generateSlug(parsed.name, async (val) => {
						return !Boolean(
							await prisma.eventPage.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		let editedPage = await prisma.eventPage.update({
			where: {
				id: page.id
			},
			data: {
				slug: slug,
				body: parsed.body,
				name: parsed.name,
				topLevel: parsed.topLevel
			}
		});

		if (!editedPage) {
			throw new NextkitError(500, 'Failed to edit page.');
		}

		return editedPage;
	}
});
