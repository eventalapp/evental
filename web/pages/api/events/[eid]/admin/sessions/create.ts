import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { CreateSessionSchema, generateSlug } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { isOrganizer } from '../../../../../../utils/attendee';

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

		const body = CreateSessionSchema.parse(req.body);

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
				await prisma.eventSession.findFirst({
					where: {
						eventId: event.id,
						slug: val
					}
				})
			);
		});

		let createdSession = await prisma.eventSession.create({
			data: {
				eventId: event.id,
				slug: slug,
				name: body.name,
				venueId: body.venueId,
				maxAttendees: body.maxAttendees,
				startDate: body.startDate,
				endDate: body.endDate,
				description: body.description,
				categoryId: body.categoryId
			}
		});

		if (!createdSession) {
			throw new NextkitError(500, 'Error creating session.');
		}

		if (body.roleMembers && body.roleMembers.length > 0) {
			const roleMemberAttendees = await prisma.$transaction(
				body.roleMembers.map((userId) => {
					return prisma.eventAttendee.findFirst({
						where: {
							eventId: event.id,
							user: {
								id: userId
							}
						}
					});
				})
			);

			const roleMemberAttendeesFiltered = roleMemberAttendees.filter(
				(val) => val !== null
			) as Prisma.EventAttendee[];

			await prisma.$transaction(
				roleMemberAttendeesFiltered.map((attendee) => {
					return prisma.eventSessionAttendee.upsert({
						where: {
							eventId_sessionId_attendeeId: {
								eventId: event.id,
								sessionId: createdSession.id,
								attendeeId: attendee.id
							}
						},
						create: {
							eventId: event.id,
							sessionId: createdSession.id,
							attendeeId: attendee.id,
							type: 'ROLE'
						},
						update: {
							eventId: event.id,
							sessionId: createdSession.id,
							attendeeId: attendee.id,
							type: 'ROLE'
						}
					});
				})
			);
		}

		return createdSession;
	}
});
