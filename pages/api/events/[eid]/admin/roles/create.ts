import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../utils/isOrganizer';
import { CreateRoleSchema } from '../../../../../../utils/schemas';
import { ServerErrorResponse } from '../../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { handleServerError } from '../../../../../../utils/handleServerError';
import { processSlug } from '../../../../../../utils/slugify';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventRole>
) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'POST') {
		try {
			let parsed = CreateRoleSchema.parse(req.body);

			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
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

			const createdRole = await prisma.eventRole.create({
				data: {
					eventId: event.id,
					name: parsed.name,
					slug: processSlug(parsed.slug),
					defaultRole: parsed.defaultRole
				}
			});

			return res.status(200).send(createdRole);
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
