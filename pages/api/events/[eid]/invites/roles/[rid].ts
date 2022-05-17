import { AcceptRoleInviteSchema } from '../../../../../../utils/schemas';
import { api } from '../../../../../../utils/api';
import { getDefaultRole } from '../../roles';
import { NextkitError } from 'nextkit';
import { prisma } from '../../../../../../prisma/client';
import { getRole } from '../../roles/[rid]';

export default api({
	async POST({ ctx, req }) {
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
