import { prisma } from '@eventalapp/shared/db/client';
import { AttendeeWithUser, stripAttendeesWithUser } from '@eventalapp/shared/utils';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';
import { getRole } from '../roles/[rid]';

export default api({
	async GET({ req }) {
		const { eid, role, name, limit, type } = req.query;

		if (type === 'name') {
			return await getAttendeesByName(String(eid), String(name), {
				limit: Number(limit) || 10
			});
		}

		if (role) {
			return await getAttendeesByRole(String(eid), String(role));
		}

		return await getAttendees(String(eid));
	}
});

export const getAttendees = async (eid: string): Promise<AttendeeWithUser[]> => {
	const event = await getEvent(eid);

	if (!event) {
		return [];
	}

	const attendees = await prisma.eventAttendee.findMany({
		where: {
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	if (!attendees || attendees.length === 0) {
		return [];
	}

	return stripAttendeesWithUser(attendees);
};

export const getAttendeesByRole = async (eid: string, rid: string): Promise<AttendeeWithUser[]> => {
	const event = await getEvent(eid);

	if (!event) {
		return [];
	}

	const role = await getRole(event.id, String(rid));

	if (!role) {
		return [];
	}

	const attendees = await prisma.eventAttendee.findMany({
		where: {
			eventRoleId: role.id,
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	if (!attendees || attendees.length === 0) {
		return [];
	}

	return stripAttendeesWithUser(attendees);
};

export const getAttendeesByName = async (
	eid: string,
	name: string,
	args: { limit?: number } = {}
): Promise<AttendeeWithUser[]> => {
	const { limit } = args;

	const event = await getEvent(eid);

	if (!event) {
		return [];
	}

	const attendees = await prisma.eventAttendee.findMany({
		take: limit,
		where: {
			user: {
				name: { contains: name }
			},
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	if (!attendees || attendees.length === 0) {
		return [];
	}

	return stripAttendeesWithUser(attendees);
};
