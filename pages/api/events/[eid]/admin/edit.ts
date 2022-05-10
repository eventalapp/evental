import { prisma } from '../../../../../prisma/client';
import { isOrganizer } from '../../../../../utils/isOrganizer';
import { EditEventSchema } from '../../../../../utils/schemas';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { busboyParseForm } from '../../../../../utils/busboyParseForm';
import { uploadAndProcessImage } from '../../../../../utils/uploadAndProcessImage';
import { EventCategory, EventType } from '@prisma/client';
import dayjs from 'dayjs';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async PUT({ req, ctx }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const { buffer, mimeType, formData } = await busboyParseForm(req);

		const body = EditEventSchema.parse(formData);

		let fileLocation = await uploadAndProcessImage(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
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

		const updatedEvent = await prisma.event.update({
			data: {
				name: body.name,
				description: body.description,
				location: body.location,
				timeZone: body.timeZone,
				startDate: dayjs(body.startDate).tz(body.timeZone).startOf('day').toDate(),
				endDate: dayjs(body.endDate).tz(body.timeZone).endOf('day').toDate(),
				image: fileLocation,
				category: EventCategory[body.category as keyof typeof EventCategory] ?? EventCategory.EVENT,
				slug: body.slug,
				type: EventType[body.type as keyof typeof EventType] ?? EventType.HYBRID
			},
			where: {
				id: event.id
			}
		});

		if (!updatedEvent) {
			throw new NextkitError(404, 'Event failed to update.');
		}

		return updatedEvent;
	}
});
