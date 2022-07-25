import dayjs from 'dayjs';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditSessionSchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/attendee';

export default api({
	async DELETE({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
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

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true
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
				id: true
			}
		});

		if (!session) {
			throw new NextkitError(404, 'Session not found.');
		}

		await prisma.eventSession.delete({
			where: {
				id: session.id
			}
		});
	},
	async PUT({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
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

		let body = EditSessionSchema.parse(req.body);

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
			body.name !== session.name
				? await generateSlug(body.name, async (val) => {
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
				name: body.name,
				venueId: body.venueId,
				maxAttendees: body.maxAttendees,
				startDate: dayjs(body.startDate).tz(event.timeZone).toDate(),
				endDate: dayjs(body.endDate).tz(event.timeZone).toDate(),
				description: body.description,
				categoryId: body.categoryId
			}
		});

		if (!editedSession) {
			throw new NextkitError(500, 'Error editing session.');
		}

		return editedSession;
	}
});
