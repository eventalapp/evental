import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { EditEventSchema } from '@eventalapp/shared/utils';

import { api } from '../../../../../utils/api';
import { isFounder, isOrganizer } from '../../../../../utils/attendee';
import { busboyParseForm } from '../../../../../utils/form';
import { uploadAndProcessAvatar } from '../../../../../utils/image';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async PUT({ req, ctx }) {
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

		const { buffer, mimeType, formData } = await busboyParseForm(req).catch((err) => {
			throw new NextkitError(500, err.message);
		});

		const body = EditEventSchema.parse(formData);

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		const event = await prisma.event.findFirst({
			where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
			select: {
				id: true,
				level: true
			}
		});

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		if (body.privacy !== 'PRIVATE' && event.level === 'TRIAL') {
			throw new NextkitError(400, 'To make your event public, you must upgrade to a premium plan.');
		}

		const updatedEvent = await prisma.event.update({
			data: {
				name: body.name,
				description: body.description,
				location: body.location,
				timeZone: body.timeZone,
				privacy: body.privacy,
				color: body.color,
				website: body.website,
				startDate: dayjs(body.startDate).tz(body.timeZone).startOf('day').toDate(),
				endDate: dayjs(body.endDate).tz(body.timeZone).endOf('day').toDate(),
				image: fileLocation,
				category:
					Prisma.EventCategory[body.category as keyof typeof Prisma.EventCategory] ??
					Prisma.EventCategory.EVENT,
				slug: body.slug,
				type:
					Prisma.EventType[body.type as keyof typeof Prisma.EventType] ?? Prisma.EventType.HYBRID
			},
			where: {
				id: event.id
			}
		});

		if (!updatedEvent) {
			throw new NextkitError(404, 'Event failed to update.');
		}

		return updatedEvent;
	},
	async DELETE({ ctx, req }) {
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

		if (!(await isFounder(String(eid), String(user?.id)))) {
			throw new NextkitError(403, 'You must be the event founder to delete this event.');
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

		await prisma.event.delete({
			where: { id: event.id }
		});
	}
});
