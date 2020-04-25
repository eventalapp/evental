import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { EventAttendeeUser } from '../attendees/[aid]';
import Prisma from '@prisma/client';

export type RoleAttendeePayload = {
	attendees: EventAttendeeUser[] | undefined;
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
		const attendees = await prisma.eventAttendee.findMany({
			where: {
				eventRoleId: role.id,
				eventId: event.id
			},
			include: {
				user: {
					select: {
						name: true,
						image: true
					}
				},
				role: {
					select: {
						name: true
					}
				}
			}
		});

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
