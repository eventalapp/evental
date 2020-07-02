import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../prisma/client';
import { api } from '../../../../../../../utils/api';
import { generateSlug } from '../../../../../../../utils/generateSlug';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditRoleSchema } from '../../../../../../../utils/schemas';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getStrippedUser();
		const { eid, rid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		if (!(await isOrganizer(String(user?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const body = EditRoleSchema.parse(req.body);

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
				name: true
			}
		});

		if (!role) {
			throw new NextkitError(404, 'Role not found.');
		}

		if (body.defaultRole) {
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
		} else if (!body.defaultRole) {
			throw new NextkitError(
				400,
				'If you want to make another role the default. Please edit that role first.'
			);
		}

		const slug: string | undefined =
			body.name !== role.name
				? await generateSlug(body.name, async (val) => {
						return !Boolean(
							await prisma.eventRole.findFirst({
								where: {
									eventId: event.id,
									slug: val
								}
							})
						);
				  })
				: undefined;

		let editedRole = await prisma.eventRole.update({
			where: {
				id: role.id
			},
			data: {
				slug: slug,
				name: body.name,
				defaultRole: body.defaultRole
			}
		});

		if (!editedRole) {
			throw new NextkitError(500, 'Failed to edit role.');
		}

		return editedRole;
	},
	async DELETE({ req, ctx }) {
		const user = await ctx.getStrippedUser();
		const { eid, rid } = req.query;

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
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
	}
});
