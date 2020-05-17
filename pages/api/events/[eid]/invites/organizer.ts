import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';
import { AcceptOrganizerInviteSchema } from '../../../../../utils/schemas';
import { prisma } from '../../../../../prisma/client';
import { getDefaultRole } from '../roles';

export default api({
	async POST({ ctx, req }) {
		const body = AcceptOrganizerInviteSchema.parse(req.body);

		const eventAndEmail = await ctx.redis.get<string>(`organizer:${body.code}`);

		if (!eventAndEmail) {
			throw new NextkitError(400, `Invalid invite code.`);
		}

		const userEmail = eventAndEmail.split(':')[1];
		const eventId = eventAndEmail.split(':')[0];

		const user = await prisma.user.findFirst({
			where: {
				email: userEmail
			}
		});

		if (!user) {
			throw new NextkitError(400, `You must sign up before accepting this invite.`);
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const attendee = await prisma.eventAttendee.findFirst({
			where: {
				eventId,
				userId: user.id
			}
		});

		await ctx.redis.del(`organizer:${body.code}`);

		if (attendee) {
			if (attendee.permissionRole === 'ORGANIZER' || attendee.permissionRole === 'FOUNDER') {
				throw new NextkitError(400, `You are already an organizer of this event.`);
			}

			await prisma.eventAttendee.update({
				where: {
					eventId_userId: {
						eventId,
						userId: user.id
					}
				},
				data: {
					permissionRole: 'ORGANIZER'
				}
			});
		} else {
			const defaultRole = await getDefaultRole(String(eventId));

			if (!defaultRole) {
				throw new NextkitError(500, `Default event role not found.`);
			}

			await prisma.eventAttendee.create({
				data: {
					eventId: eventId,
					userId: user.id,
					eventRoleId: defaultRole.id,
					permissionRole: 'ORGANIZER'
				}
			});
		}
	}
});
