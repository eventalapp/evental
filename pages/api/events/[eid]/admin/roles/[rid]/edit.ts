import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditRoleSchema } from '../../../../../../../utils/schemas';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, rid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const parsed = EditRoleSchema.parse(req.body);

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
				id: true
			}
		});

		if (!role) {
			throw new NextkitError(404, 'Role not found.');
		}

		if (parsed.defaultRole) {
			//Find all roles that already have defaultRole set to true
			const existingDefaultRoles = await prisma.eventRole.findMany({
				where: {
					eventId: event.id,
					defaultRole: true
				},
				select: {
					id: true
				}
			});

			if (existingDefaultRoles) {
				//Set all existing default roles to false
				await prisma.$transaction(
					existingDefaultRoles.map((existingDefaultRole) =>
						prisma.eventRole.update({
							where: {
								id: existingDefaultRole.id
							},
							data: {
								defaultRole: false
							}
						})
					)
				);
			}
		} else if (!parsed.defaultRole) {
			throw new NextkitError(
				400,
				'If you with to make another role the default. Please edit that role.'
			);
		}

		let editedRole = await prisma.eventRole.update({
			where: {
				id: role.id
			},
			data: {
				name: parsed.name,
				defaultRole: parsed.defaultRole
			}
		});

		if (!editedRole) {
			throw new NextkitError(500, 'Failed to edit role.');
		}

		return editedRole;
	}
});
