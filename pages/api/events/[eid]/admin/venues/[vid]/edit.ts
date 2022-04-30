import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditVenueSchema } from '../../../../../../../utils/schemas';
import { processSlug } from '../../../../../../../utils/slugify';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, vid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const parsed = EditVenueSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const venue = await prisma.eventVenue.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(vid) }, { slug: String(vid) }]
			},
			select: {
				id: true
			}
		});

		if (!venue) {
			throw new NextkitError(404, 'Venue not found.');
		}

		const editedVenue = await prisma.eventVenue.update({
			where: {
				id: venue.id
			},
			data: {
				slug: processSlug(parsed.slug),
				name: parsed.name,
				description: parsed.description
			}
		});

		if (!editedVenue) {
			throw new NextkitError(500, 'Venue failed to update.');
		}

		return editedVenue;
	}
});
