import dayjs from 'dayjs';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { CreateEventSchema, generateSlug } from '@eventalapp/shared/utils';

import { theme } from '../../../tailwind.config';
import { api } from '../../../utils/api';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const body = CreateEventSchema.parse(req.body);

		const slug = await generateSlug(body.name, async (val) => {
			return !Boolean(
				await prisma.event.findFirst({
					where: {
						slug: val
					}
				})
			);
		});

		const event = await prisma.event.create({
			data: {
				slug: slug,
				name: body.name,
				startDate: dayjs(body.startDate).tz(body.timeZone).startOf('day').toDate(),
				endDate: dayjs(body.endDate).tz(body.timeZone).endOf('day').toDate(),
				timeZone: body.timeZone,
				color: theme.extend.colors.primary.DEFAULT
			}
		});

		if (!event) {
			throw new NextkitError(500, 'Could not create event.');
		}

		const defaultRole = await prisma.eventRole.create({
			data: {
				name: 'Attendee',
				slug: 'attendee',
				eventId: String(event.id),
				defaultRole: true
			}
		});

		const eventRoles = await prisma.eventRole.createMany({
			data: [
				{
					name: 'Speaker',
					slug: 'speaker',
					eventId: String(event.id),
					defaultRole: false
				},
				{
					name: 'Sponsor',
					slug: 'sponsor',
					eventId: String(event.id),
					defaultRole: false
				}
			]
		});

		if (!eventRoles || !defaultRole) {
			throw new NextkitError(500, 'Could not create roles.');
		}

		let eventAttendee = await prisma.eventAttendee.create({
			data: {
				eventId: event.id,
				permissionRole: 'FOUNDER',
				userId: user.id,
				eventRoleId: String(defaultRole.id)
			}
		});

		if (!eventAttendee) {
			throw new NextkitError(500, 'Could not create attendee.');
		}

		return event;
	}
});
