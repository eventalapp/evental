import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { EventAttendeeUser } from '../attendees/[aid]';
import type Prisma from '@prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
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

		if (!role) {
			return res.status(404).send({ error: { message: 'Role not found' } });
		}

		const attendees = await getAttendeesByRole(String(eid), String(rid));

		if (!attendees) {
			return res.status(404).send({ error: { message: 'Attendees not found' } });
		}

		const payload: RoleAttendeePayload = { attendees, role };

		return res.status(200).send(payload);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getRole = async (eid: string, rid: string): Promise<Prisma.EventRole | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const role = await prisma.eventRole.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: String(rid) }, { slug: String(rid) }]
		}
	});

	if (!role) {
		return null;
	}

	return role;
};

export const getAttendeesByRole = async (
	eid: string,
	rid: string
): Promise<EventAttendeeUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const role = await getRole(event.id, String(rid));

	if (!role) {
		return null;
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
