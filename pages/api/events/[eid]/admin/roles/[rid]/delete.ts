import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import { handleServerError } from '../../../../../../../utils/handleServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | string>) => {
	const session = await getSession({ req });
	const { eid, rid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'DELETE') {
		try {
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
					id: true,
					defaultRole: true
				}
			});

			if (!role) {
				return res.status(404).send({ error: { message: 'Role not found.' } });
			}

			const roleMembers = await prisma.eventAttendee.findFirst({
				where: {
					eventRoleId: role.id
				}
			});

			if (role.defaultRole) {
				return res.status(500).send({
					error: {
						message:
							'Cannot delete the default role. Please make another role the default to remove this role.'
					}
				});
			}

			if (roleMembers) {
				return res.status(500).send({
					error: {
						message:
							'Cannot delete role with members. First remove all members from a role to delete it.'
					}
				});
			}

			await prisma.eventRole.delete({
				where: {
					id: role.id
				}
			});

			return res.status(200).send('Role deleted.');
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
