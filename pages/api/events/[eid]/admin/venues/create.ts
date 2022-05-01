import { prisma } from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateVenueSchema } from '../../../../../../utils/schemas';
import { processSlug } from '../../../../../../utils/slugify';
import { api } from '../../../../../../utils/api';
import { NextkitError } from 'nextkit';

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

		const parsed = CreateVenueSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const createdSession = await prisma.eventVenue.create({
			data: {
				eventId: event.id,
				slug: processSlug(parsed.slug),
				name: parsed.name,
				description: parsed.description
			}
		});

		if (!createdSession) {
			throw new NextkitError(500, 'Session failed to create.');
		}

		return createdSession;
	}
});
