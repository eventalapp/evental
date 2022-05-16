import { prisma } from '../../../prisma/client';
import Prisma from '@prisma/client';
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
			endDate: {
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
