import Prisma from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../prisma/client';
import { api } from '../../../utils/api';

export default api({
	async GET({ ctx }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		return await getOrganizingEvents(user.id);
	}
});

export const getOrganizingEvents = async (uid: string): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		orderBy: [
			{
				startDate: 'asc'
			}
		],
		where: {
			attendees: {
				some: {
					userId: uid,
					OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
				}
			}
		}
	});
};
