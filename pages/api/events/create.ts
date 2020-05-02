import { CreateEventSchema } from '../../../utils/schemas';
import { prisma } from '../../../prisma/client';
import { processSlug } from '../../../utils/slugify';
import { api } from '../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const parsed = CreateEventSchema.parse(req.body);

		const event = await prisma.event.create({
			data: {
				slug: processSlug(parsed.slug),
				name: parsed.name,
				location: parsed.location,
				startDate: parsed.startDate,
				endDate: parsed.endDate,
				description: parsed.description,
				image: parsed.image
			}
		});

		if (!event) {
			throw new NextkitError(500, 'Could not create event.');
		}

		const eventRole = await prisma.eventRole.create({
			data: {
				name: 'Attendee',
				slug: 'attendee',
				eventId: String(event.id),
				defaultRole: true
			}
		});

		if (!eventRole) {
			throw new NextkitError(500, 'Could not create role.');
		}

		let eventAttendee = await prisma.eventAttendee.create({
			data: {
				eventId: event.id,
				permissionRole: 'FOUNDER',
				userId: user.id,
				eventRoleId: String(eventRole.id)
			}
		});

		if (!eventAttendee) {
			throw new NextkitError(500, 'Could not create attendee.');
		}

		return event;
	}
});
