import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../utils/api';
import { CreateSessionTypeSchema } from '../../../../../../../utils/schemas';
import { generateSlug } from '../../../../../../../utils/generateSlug';
import { NextkitError } from 'nextkit';
import { prisma } from '../../../../../../../prisma/client';
import { getEvent } from '../../../index';

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

		const parsed = CreateSessionTypeSchema.parse(req.body);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const slug = await generateSlug(parsed.name, async (val) => {
			return !Boolean(
				await prisma.eventSessionType.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		let createdSessionType = await prisma.eventSessionType.create({
			data: {
				eventId: event.id,
				slug: slug,
				name: parsed.name,
				color: parsed.color
			}
		});

		if (!createdSessionType) {
			throw new NextkitError(500, 'Error creating session.');
		}

		return createdSessionType;
	}
});
