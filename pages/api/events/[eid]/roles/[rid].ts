import { prisma } from '../../../../../prisma/client';
import { EventAttendeeUser } from '../attendees/[aid]';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export type RoleAttendeePayload = {
	attendees: EventAttendeeUser[] | undefined;
	role: Prisma.EventRole | undefined;
};

export default api({
	async GET({ req }) {
		const { eid, rid } = req.query;

		const role = await getRole(String(eid), String(rid));

		if (!role) {
			throw new NextkitError(404, 'Role not found');
		}

		const attendees = await getAttendeesByRole(String(eid), String(rid));

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		const payload: RoleAttendeePayload = { attendees, role };

		return payload;
	}
});

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
