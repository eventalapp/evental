import { prisma } from '../../../../../prisma/client';
import { isOrganizer } from '../../../../../utils/isOrganizer';
import { EditEventSchema } from '../../../../../utils/schemas';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { busboyParseForm } from '../../../../../utils/busboyParseForm';
import { uploadAndProcessImage } from '../../../../../utils/uploadAndProcessImage';

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

		if (fileLocation) {
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
					startDate: body.startDate,
					endDate: body.endDate,
					image: fileLocation,
					slug: body.slug
				},
				where: {
					id: event.id
				}
			});

			if (!updatedEvent) {
				throw new NextkitError(404, 'Event failed to update.');
			}

			return updatedEvent;
		} else if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}
	}
});
