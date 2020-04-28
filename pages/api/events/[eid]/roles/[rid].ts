import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { EventAttendeeUser } from '../attendees/[aid]';
import type Prisma from '@prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { getEvent } from '../index';

export type RoleAttendeePayload = {
	attendees: EventAttendeeUser[] | undefined;
	role: Prisma.EventRole | undefined;
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | RoleAttendeePayload>
) => {
	try {
		const { eid, rid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const role = await getRole(event.id, String(rid));

		if (!role) {
			return res.status(404).send({ error: { message: 'Role not found.' } });
		}

		const attendees = await getAttendees(event.id, role.id);

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

export const getRole = async (eventId: string, rid: string): Promise<Prisma.EventRole | null> => {
	return await prisma.eventRole.findFirst({
		where: {
			eventId: eventId,
			OR: [{ id: String(rid) }, { slug: String(rid) }]
		}
	});
};

export const getAttendees = async (
	eventId: string,
	roleId: string
): Promise<EventAttendeeUser[]> => {
	return await prisma.eventAttendee.findMany({
		where: {
			eventRoleId: roleId,
			eventId: eventId
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
};
