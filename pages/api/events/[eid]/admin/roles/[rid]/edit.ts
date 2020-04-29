import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditRoleSchema } from '../../../../../../../utils/schemas';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../../../utils/handleServerError';
import { processSlug } from '../../../../../../../utils/slugify';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventRole>
) => {
	const session = await getSession({ req });
	const { eid, rid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'PUT') {
		try {
			const parsed = EditRoleSchema.parse(req.body);

			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
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
				return res.status(404).send({ error: { message: 'Role not found.' } });
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
			}

			let editedRole = await prisma.eventRole.update({
				where: {
					id: role.id
				},
				data: {
					slug: processSlug(parsed.slug),
					name: parsed.name,
					defaultRole: parsed.defaultRole
				}
			});

			return res.status(200).send(editedRole);
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
