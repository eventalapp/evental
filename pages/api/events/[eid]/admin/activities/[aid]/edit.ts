import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditActivitySchema } from '../../../../../../../utils/schemas';
import { processSlug } from '../../../../../../../utils/slugify';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, aid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}
		let parsed = EditActivitySchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const activity = await prisma.eventActivity.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(aid) }, { slug: String(aid) }]
			},
			select: {
				id: true
			}
		});

		if (!activity) {
			throw new NextkitError(404, 'Activity not found.');
		}

		const editedActivity = await prisma.eventActivity.update({
			where: {
				id: activity.id
			},
			data: {
				eventId: event.id,
				slug: processSlug(parsed.slug),
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				description: parsed.description
			}
		});

		if (!editedActivity) {
			throw new NextkitError(500, 'Error editing activity.');
		}

		return editedActivity;
	}
});
