import * as Prisma from '@prisma/client';

import { prisma } from '@eventalapp/shared/db/client';

import { api } from '../../../utils/api';

export default api({
	async GET() {
		return await getUpcomingEvents();
	}
});

export const getUpcomingEvents = async (): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		where: {
			privacy: 'PUBLIC',
			startDate: {
				gte: new Date()
			}
		},
		orderBy: [
			{
				startDate: 'asc'
			}
		]
	});
};
