import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditRoleSchema } from '../../../../../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid, rid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ message: 'You must be an organizer to do this.' });
	}

	if (req.method === 'PUT') {
		try {
			let bodyParsed = EditRoleSchema.parse(req.body);

			let event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send('Event not found.');
			}

			let role = await prisma.eventRole.findFirst({
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

			let editedRole = await prisma.eventRole.update({
				where: {
					id: role.id
				},
				data: {
					slug: bodyParsed.slug,
					name: bodyParsed.name
				}
			});

			return res.status(200).send(editedRole);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);

				return res.status(500).send(error.message);
			}

			return res.status(500).send('An error occurred, please try again.');
		}
	}

	return res.status(204).end();
};
