import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { eventMemberInclude } from '../attendees/[aid]';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, rid } = req.query;

	// Get all members of a role

	try {
		const role = await prisma.eventRole.findFirst({
			where: {
				OR: [{ id: String(rid) }, { slug: String(rid) }]
			}
		});

		if (!role) {
			return res.status(404).send({ error: { message: 'Role not found.' } });
		}

		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const attendees = await prisma.eventMember.findMany({
			where: {
				eventRoleId: role.id,
				eventId: event.id
			},
			include: {
				...eventMemberInclude
			}
		});

		return res.status(200).send({ attendees, role });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
