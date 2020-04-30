import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { NextkitError } from 'nextkit';
import { api } from '../../../../../utils/api';

export default api({
	async GET({ req }) {
		const { eid } = req.query;

		const activityList = await getActivities(String(eid));

		if (!activityList) {
			throw new NextkitError(404, 'Activities not found');
		}

		return activityList;
	}
});

export const getActivities = async (eid: string): Promise<Prisma.EventActivity[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	return await prisma.eventActivity.findMany({
		where: {
			eventId: event.id
		}
	});
};
