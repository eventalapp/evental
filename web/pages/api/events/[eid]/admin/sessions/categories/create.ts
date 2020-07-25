import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { CreateSessionCategorySchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/attendee';
import { getEvent } from '../../../index';

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

		const body = CreateSessionCategorySchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const slug = await generateSlug(body.name, async (val) => {
			return !Boolean(
				await prisma.eventSessionCategory.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		let createdSessionCategory = await prisma.eventSessionCategory.create({
			data: {
				eventId: event.id,
				slug: slug,
				name: body.name,
				color: body.color
			}
		});

		if (!createdSessionCategory) {
			throw new NextkitError(500, 'Error creating session.');
		}

		return createdSessionCategory;
	}
});
