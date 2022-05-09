import { prisma } from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreatePageSchema } from '../../../../../../utils/schemas';
import { api } from '../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { generateSlug } from '../../../../../../utils/generateSlug';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const parsed = CreatePageSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const slug = await generateSlug(parsed.name, async (val) => {
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
				name: parsed.name,
				slug: slug,
				body: parsed.body,
				topLevel: parsed.topLevel
			}
		});

		if (!createdPage) {
			throw new NextkitError(500, 'Failed to create page.');
		}

		return createdPage;
	}
});
