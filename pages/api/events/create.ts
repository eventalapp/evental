import { CreateEventSchema } from '../../../utils/schemas';
import { prisma } from '../../../prisma/client';
import { api } from '../../../utils/api';
import { NextkitError } from 'nextkit';
import { generateSlug } from '../../../utils/generateSlug';
import dayjs from 'dayjs';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const parsed = CreateEventSchema.parse(req.body);

		const slug = await generateSlug(parsed.name, async (val) => {
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
				name: parsed.name,
				startDate: dayjs(parsed.startDate).tz(parsed.timeZone).startOf('day').toDate(),
				endDate: dayjs(parsed.endDate).tz(parsed.timeZone).endOf('day').toDate(),
				timeZone: parsed.timeZone
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
