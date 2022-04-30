import { prisma } from '../../../../../prisma/client';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ req }) {
		const { eid, aid } = req.query;

		const activity = await getActivity(String(eid), String(aid));

		if (!activity) {
			throw new NextkitError(404, 'Activity not found.');
		}

		return activity;
	}
});

export const getActivity = async (
	eid: string,
	aid: string
): Promise<Prisma.EventActivity | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const activity = await prisma.eventActivity.findFirst({
		where: {
			eventId: event.id,
			OR: [{ id: aid }, { slug: aid }]
		}
	});

	if (!activity) {
		return null;
	}

	return activity;
};
