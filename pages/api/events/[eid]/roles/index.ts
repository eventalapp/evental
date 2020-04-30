import { prisma } from '../../../../../prisma/client';
import type Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const roles = await getRoles(String(eid));

		if (roles && roles.length === 0) {
			const role = await prisma.eventRole.create({
				data: {
					name: 'Attendee',
					slug: 'attendee',
					eventId: String(eid),
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
