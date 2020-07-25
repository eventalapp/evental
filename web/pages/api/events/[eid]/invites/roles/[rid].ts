import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { AcceptRoleInviteSchema } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { getDefaultRole } from '../../roles';
import { getRole } from '../../roles/[rid]';

export default api({
	async POST({ ctx, req }) {
		const currentUser = await ctx.getSelfFullUser();
		const body = AcceptRoleInviteSchema.parse(req.body);

		const eventRoleAndEmail = await ctx.redis.get<string>(`role:${body.code}`);

		if (!eventRoleAndEmail) {
			throw new NextkitError(400, `Invalid invite code.`);
		}
		const eventId = eventRoleAndEmail.split(':')[0];
		const roleId = eventRoleAndEmail.split(':')[1];
		const userEmail = eventRoleAndEmail.split(':')[2];

		const user = await prisma.user.findFirst({
			where: {
				email: userEmail
			}
		});

		if (currentUser && currentUser.email !== userEmail) {
			throw new NextkitError(
				400,
				`You must sign into the account with the email of "${userEmail}" to accept this invite.`
			);
		}

		if (!user) {
			throw new NextkitError(400, `You must sign up before accepting this invite.`);
		}

		if (currentUser && currentUser.email === userEmail) {
			// When a user has signed up, and followed the link from their email, we can assume their account is verifiable.
			await prisma.user.update({
				where: {
					id: currentUser.id
				},
				data: {
					emailVerified: new Date()
				}
			});
		} else if (!user.emailVerified) {
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

		const role = await getRole(eventId, roleId);

		if (!role) {
			throw new NextkitError(404, `Role not found.`);
		}

		await ctx.redis.del(`role:${body.code}`);

		if (attendee) {
			await prisma.eventAttendee.update({
				where: {
					eventId_userId: {
						eventId,
						userId: user.id
					}
				},
				data: {
					eventRoleId: role.id
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
					eventRoleId: role.id,
					permissionRole: 'ATTENDEE'
				}
			});
		}
	}
});
