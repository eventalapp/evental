import { NextkitError } from 'nextkit';

import { sendClaimProfile } from '../../../../../../../../email/templates/claimProfile';
import { api } from '../../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../../utils/attendee';
import { CLAIM_PROFILE_EXPIRY } from '../../../../../../../../utils/config';
import { busboyParseForm } from '../../../../../../../../utils/form';
import { uploadAndProcessAvatar } from '../../../../../../../../utils/image';
import { EditUserSchema } from '../../../../../../../../utils/schemas';
import { getEvent } from '../../../../index';

export const config = {
	api: {
		bodyParser: false
	}
};

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
				'This user has been claimed and cannot be edited. Contact this user or create a new attendee.'
			);
		}

		if (body.email && body.email !== userToEdit.email) {
			const doesUserWithEmailExist = await ctx.prisma.user.findFirst({
				where: {
					email: body.email
				}
			});

			if (doesUserWithEmailExist) {
				throw new NextkitError(
					400,
					'User with email already exists. Please choose a different email or invite this user to your event.'
				);
			}
		}

		const isUserToEditAttending = await ctx.prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				userId: userToEdit.id
			},
			include: {
				role: true
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

		const updatedUser = await ctx.prisma.user.update({
			where: {
				id: userToEdit.id
			},
			data: {
				...body,
				image: fileLocation
			}
		});

		if (body.email && body.email !== userToEdit.email) {
			const claimCode = await ctx.getClaimProfileCode();

			await ctx.redis.set(`claim:${claimCode}`, updatedUser.id, {
				ex: CLAIM_PROFILE_EXPIRY
			});

			await sendClaimProfile({
				toAddresses: [body.email],
				inviterName: requestingUser.name,
				event,
				role: isUserToEditAttending.role,
				claimCode
			});
		}
	}
});
