import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../prisma/client';
import { api } from '../../../../../../utils/api';
import { generateSlug } from '../../../../../../utils/generateSlug';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateVenueSchema } from '../../../../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
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

		const body = CreateVenueSchema.parse(req.body);

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
				await prisma.eventVenue.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		const createdSession = await prisma.eventVenue.create({
			data: {
				eventId: event.id,
				slug: slug,
				name: body.name,
				address: body.address,
				description: body.description
			}
		});

		if (!createdSession) {
			throw new NextkitError(500, 'Session failed to create.');
		}

		return createdSession;
	}
});
