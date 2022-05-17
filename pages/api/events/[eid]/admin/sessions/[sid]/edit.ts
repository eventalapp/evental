import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditSessionSchema } from '../../../../../../../utils/schemas';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { generateSlug } from '../../../../../../../utils/generateSlug';
import dayjs from 'dayjs';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, sid } = req.query;

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

		let parsed = EditSessionSchema.parse(req.body);

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true,
				timeZone: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const session = await prisma.eventSession.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(sid) }, { slug: String(sid) }]
			},
			select: {
				id: true,
				name: true
			}
		});

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		const slug: string | undefined =
			parsed.name !== session.name
				? await generateSlug(parsed.name, async (val) => {
						return !Boolean(
							await prisma.eventSession.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		const editedSession = await prisma.eventSession.update({
			where: {
				id: session.id
			},
			data: {
				eventId: event.id,
				slug,
				name: parsed.name,
				venueId: parsed.venueId,
				startDate: dayjs(parsed.startDate).tz(event.timeZone).toDate(),
				endDate: dayjs(parsed.endDate).tz(event.timeZone).toDate(),
				description: parsed.description,
				typeId: parsed.typeId
			}
		});

		if (!editedSession) {
			throw new NextkitError(500, 'Error editing session.');
		}

		return editedSession;
	}
});
