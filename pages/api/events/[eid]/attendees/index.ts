import { prisma } from '../../../../../prisma/client';

import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../utils/stripUserPassword';
import { getRole } from '../roles/[rid]';

export default api({
	async GET({ req }) {
		const { eid, role, name } = req.query;

		if (name) {
			const attendeesByName = await getAttendeesByName(String(eid), String(name));

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
	name: string
): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const attendees = await prisma.eventAttendee.findMany({
		take: 10,
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
