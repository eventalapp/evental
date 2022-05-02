import { prisma } from '../../../../../prisma/client';
import { isOrganizer } from '../../../../../utils/isOrganizer';
import { EditEventSchema } from '../../../../../utils/schemas';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async PUT({ req, ctx }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}
		const parsed = EditEventSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const updatedEvent = await prisma.event.update({
			data: {
				name: parsed.name,
				description: parsed.description,
				location: parsed.location,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				image: parsed.image,
				slug: parsed.slug
			},
			where: {
				id: event.id
			}
		});

		if (!updatedEvent) {
			throw new NextkitError(404, 'Event failed to update.');
		}

		return updatedEvent;
	}
});
