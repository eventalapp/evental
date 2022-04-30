import { prisma } from '../../../prisma/client';
import Prisma from '@prisma/client';
import { api } from '../../../utils/api';

export default api({
	async GET() {
		return await getEvents();
	}
});

export const getEvents = async (): Promise<Prisma.Event[]> => {
	return await prisma.event.findMany({
		orderBy: [
			{
				startDate: 'asc'
			}
		]
	});
};
