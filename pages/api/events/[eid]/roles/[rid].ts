import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { EventAttendeeUser } from '../attendees/[aid]';
import type Prisma from '@prisma/client';
import { ServerError, ServerErrorResponse } from '../../../../../utils/ServerError';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

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

		const role = await getRole(String(eid), String(rid));

		const attendees = await getAttendeesByRole(String(eid), String(rid));

		const payload: RoleAttendeePayload = { attendees, role };

		return res.status(200).send(payload);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getRole = async (eid: string, rid: string): Promise<Prisma.EventRole> => {
	const event = await getEvent(eid);

	if (!event) {
		throw new ServerError('Event not found.', 404);
	}

	const role = await prisma.eventRole.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: String(rid) }, { slug: String(rid) }]
		}
	});

	if (!role) {
		throw new ServerError('Role not found.', 404);
	}

	return role;
};

export const getAttendeesByRole = async (
	eid: string,
	rid: string
): Promise<EventAttendeeUser[]> => {
	const event = await getEvent(eid);

	if (!event) {
		throw new ServerError('Event not found.', 404);
	}

	const role = await getRole(event.id, String(rid));

	if (!role) {
		throw new ServerError('Role not found.', 404);
	}

	return await prisma.eventAttendee.findMany({
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
};
