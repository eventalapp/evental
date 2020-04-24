import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { eventMemberInclude, EventMemberUser } from '../attendees/[aid]';
import Prisma from '@prisma/client';

export type RoleAttendeePayload = {
	attendees: EventMemberUser[] | undefined;
	role: Prisma.EventRole | undefined;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, rid } = req.query;

	// Get all members of a role

	try {
		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const role = await prisma.eventRole.findFirst({
			where: {
				eventId: event.id,
				OR: [{ id: String(rid) }, { slug: String(rid) }]
			}
		});

		if (!role) {
			return res.status(404).send({ error: { message: 'Role not found.' } });
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

		console.log(eid, rid, event, role, attendees);

		const payload: RoleAttendeePayload = { attendees, role };

		return res.status(200).send(payload);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
