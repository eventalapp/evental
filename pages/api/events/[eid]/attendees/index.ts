import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../prisma/client';
import { api } from '../../../../../utils/api';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../utils/stripUserPassword';
import { getEvent } from '../index';
import { getRole } from '../roles/[rid]';

export default api({
	async GET({ req }) {
		const { eid, role, name, limit, type } = req.query;

		if (type === 'name') {
			const attendeesByName = await getAttendeesByName(String(eid), String(name), {
				limit: Number(limit) || 10
			});

			if (!attendeesByName) {
				throw new NextkitError(404, 'Attendees not found');
			}

			return attendeesByName;
		}

		if (role) {
			const attendeesByRole = await getAttendeesByRole(String(eid), String(role));

			if (!attendeesByRole) {
				throw new NextkitError(404, 'Attendees not found');
			}

			return attendeesByRole;
		}

		const attendees = await getAttendees(String(eid));

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export const getAttendees = async (eid: string): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
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

	return stripAttendeesWithUserPassword(attendees);
};

export const getAttendeesByRole = async (
	eid: string,
	rid: string
): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const role = await getRole(event.id, String(rid));

	if (!role) {
		return null;
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

	if (!attendees) {
		return null;
	}

	return stripAttendeesWithUserPassword(attendees);
};

export const getAttendeesByName = async (
	eid: string,
	name: string,
	args: { limit?: number } = {}
): Promise<AttendeeWithUser[] | null> => {
	const { limit } = args;

	const event = await getEvent(eid);

	if (!event) {
		return null;
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

	if (!attendees) {
		return null;
	}

	return stripAttendeesWithUserPassword(attendees);
};
