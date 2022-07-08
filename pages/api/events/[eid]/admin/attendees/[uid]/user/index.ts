import { NextkitError } from 'nextkit';

import { api } from '../../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../../utils/attendee';
import { busboyParseForm } from '../../../../../../../../utils/form';
import { uploadAndProcessAvatar } from '../../../../../../../../utils/image';
import { EditUserSchema } from '../../../../../../../../utils/schemas';
import { getEvent } from '../../../../index';

export default api({
	async PUT({ ctx, req }) {
		const { eid, uid } = req.query;

		const requestingUser = await ctx.getSelfStrippedUser();

		if (!requestingUser?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(requestingUser?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const { buffer, mimeType, formData } = await busboyParseForm(req).catch((err) => {
			throw new NextkitError(500, err.message);
		});

		const body = EditUserSchema.parse(formData);

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const userToEdit = await ctx.getFullUser(String(uid));

		if (!userToEdit) {
			throw new NextkitError(404, 'user not found.');
		}

		if (userToEdit.claimedAt) {
			throw new NextkitError(
				400,
				'This user has been claimed and cannot be edited. Contact this user or create  a new attendee.'
			);
		}

		const isUserToEditAttending = await ctx.prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				userId: userToEdit.id
			}
		});

		if (!isUserToEditAttending) {
			throw new NextkitError(
				400,
				'This unclaimed user is not attending the event you are organizing, you do not have permission to do this.'
			);
		}

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		await ctx.prisma.user.update({
			where: {
				id: userToEdit.id
			},
			data: {
				...body,
				image: fileLocation
			}
		});
	}
});
