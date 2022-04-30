import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { api } from '../../../../../utils/api';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		return await getVenues(String(eid));
	}
});

export const getVenues = async (eid: string): Promise<Prisma.EventVenue[]> => {
	return await prisma.eventVenue.findMany({
		where: {
			event: {
				OR: [{ id: eid }, { slug: eid }]
			}
		}
	});
};
