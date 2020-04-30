import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async DELETE({ req }) {
		const user = await ctx.getUser();
		const { eid, rid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
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

		const role = await prisma.eventRole.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(rid) }, { slug: String(rid) }]
			},
			select: {
				id: true,
				defaultRole: true
			}
		});

		if (!role) {
			throw new NextkitError(404, 'Role not found.');
		}

		const roleMembers = await prisma.eventAttendee.findFirst({
			where: {
				eventRoleId: role.id
			}
		});

		if (role.defaultRole) {
			throw new NextkitError(
				500,
				'Cannot delete the default role. Please make another role the default to remove this role.'
			);
		}

		if (roleMembers) {
			throw new NextkitError(
				500,
				'Cannot delete role with members. First remove all members from a role to delete it.'
			);
		}

		await prisma.eventRole.delete({
			where: {
				id: role.id
			}
		});

		return 'Role deleted.';
	}
});
