import * as Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../../../utils/api';
import { getEvent } from '../index';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found');
		}

		const roles = await getRoles(String(eid));

		if (roles && roles.length === 0) {
			const role = await prisma.eventRole.create({
				data: {
					name: 'Attendee',
					slug: 'attendee',
					eventId: event.id,
					defaultRole: true
				}
			});

			return [role];
		}

		if (!roles) {
			throw new NextkitError(404, 'Roles not found');
		}

		return roles;
	}
});

export const getRoles = async (eid: string): Promise<Prisma.EventRole[] | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	return await prisma.eventRole.findMany({
		where: {
			eventId: event.id
		}
	});
};

export const getDefaultRole = async (eid: string): Promise<Prisma.EventRole | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	return await prisma.eventRole.findFirst({
		where: {
			eventId: event.id,
			defaultRole: true
		}
	});
};
