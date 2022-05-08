import { prisma } from '../../../../../prisma/client';

import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../utils/stripUserPassword';
import { PageOptions, PaginationData, SESSIONS_PER_PAGE } from '../sessions';
import { getRole } from '../roles/[rid]';

export type PaginatedAttendeesWithUser = {
	attendees: AttendeeWithUser[];
	pagination: PaginationData;
};

export default api({
	async GET({ req }) {
		const { eid, page, role } = req.query;

		const pageParsed = page ? parseInt(String(page)) : 1;

		if (role) {
			const attendeesByRole = await getAttendeesByRole(String(eid), String(role), {
				page: pageParsed
			});

			if (!attendeesByRole) {
				throw new NextkitError(404, 'Attendees not found');
			}

			return attendeesByRole;
		}

		const attendees = await getAttendees(String(eid), { page: pageParsed });

		if (!attendees) {
			throw new NextkitError(404, 'Attendees not found');
		}

		return attendees;
	}
});

export const getAttendees = async (
	eid: string,
	args: PageOptions = {}
): Promise<PaginatedAttendeesWithUser | null> => {
	const { page = 1 } = args;

	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const count = await prisma.eventAttendee.count({
		where: {
			eventId: event.id
		}
	});

	const attendees = await prisma.eventAttendee.findMany({
		take: SESSIONS_PER_PAGE,
		skip: (page - 1) * SESSIONS_PER_PAGE,
		where: {
			eventId: event.id
		},
		include: {
			user: true,
			role: true
		}
	});

	return {
		attendees: stripAttendeesWithUserPassword(attendees),
		pagination: {
			total: count,
			pageCount: Math.ceil(count / SESSIONS_PER_PAGE),
			currentPage: page,
			perPage: SESSIONS_PER_PAGE,
			from: (page - 1) * SESSIONS_PER_PAGE + 1,
			to: (page - 1) * SESSIONS_PER_PAGE + attendees.length
		}
	};
};

export const getAttendeesByRole = async (
	eid: string,
	rid: string,
	args: PageOptions = {}
): Promise<PaginatedAttendeesWithUser | null> => {
	const { page = 1 } = args;

	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const role = await getRole(event.id, String(rid));

	if (!role) {
		return null;
	}

	const count = await prisma.eventAttendee.count({
		where: {
			eventRoleId: role.id,
			eventId: event.id
		}
	});

	const attendees = await prisma.eventAttendee.findMany({
		take: SESSIONS_PER_PAGE,
		skip: (page - 1) * SESSIONS_PER_PAGE,
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

	return {
		attendees: stripAttendeesWithUserPassword(attendees),
		pagination: {
			total: count,
			pageCount: Math.ceil(count / SESSIONS_PER_PAGE),
			currentPage: page,
			perPage: SESSIONS_PER_PAGE,
			from: (page - 1) * SESSIONS_PER_PAGE + 1,
			to: (page - 1) * SESSIONS_PER_PAGE + attendees.length
		}
	};
};
