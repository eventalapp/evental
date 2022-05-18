import { AdminCreateAttendeeSchema } from '../../../../../../utils/schemas';
import { busboyParseForm } from '../../../../../../utils/busboyParseForm';
import { api } from '../../../../../../utils/api';
import { uploadAndProcessAvatar } from '../../../../../../utils/uploadAndProcessImage';
import { NextkitError } from 'nextkit';
import { prisma } from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { getEvent } from '../../index';
import { sendClaimProfileEmail } from '../../../../../../email/sendClaimProfileEmail';
import { getRole } from '../../roles/[rid]';
import { CLAIM_PROFILE_EXPIRY } from '../../../../../../config';
import { generateSlug } from '../../../../../../utils/generateSlug';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async POST({ ctx, req }) {
		const { eid } = req.query;

		const requestingUser = await ctx.getUser();

		if (!requestingUser?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!requestingUser.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(requestingUser.id, String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const { buffer, mimeType, formData } = await busboyParseForm(req);

		const body = AdminCreateAttendeeSchema.parse(formData);

		let fileLocation = await uploadAndProcessAvatar(buffer, mimeType);

		if (!fileLocation && buffer.length >= 1) {
			throw new NextkitError(500, 'Image failed to upload.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const role = await getRole(event.id, body.eventRoleId);

		if (!role) {
			throw new NextkitError(404, 'Role not found.');
		}

		const userExists = await prisma.user.findFirst({
			where: {
				email: body.email
			}
		});

		if (userExists) {
			throw new NextkitError(
				400,
				'User with this email already exists. Please invite this user instead.'
			);
		}

		const slug = await generateSlug(body.name, async (val) => {
			return !Boolean(
				await prisma.user.findFirst({
					where: {
						slug: val
					}
				})
			);
		});

		const user = await prisma.user.create({
			data: {
				name: body.name,
				description: body.description,
				location: body.location,
				website: body.website,
				email: body.email,
				role: 'USER',
				slug: slug,
				company: body.company,
				position: body.position,
				password: null,
				image: fileLocation
			}
		});

		const attendee = await prisma.eventAttendee.create({
			data: {
				eventId: event.id,
				userId: user.id,
				permissionRole: 'ATTENDEE',
				eventRoleId: body.eventRoleId
			}
		});

		const claimCode = await ctx.getClaimProfileCode();

		await ctx.redis.set(`claim:${claimCode}`, user.id, {
			ex: CLAIM_PROFILE_EXPIRY
		});

		try {
			await sendClaimProfileEmail({
				sendToAddress: user.email,
				inviterName: requestingUser.name,
				event,
				role,
				claimCode
			});
		} catch {
			// silent fail
		}
	}
});