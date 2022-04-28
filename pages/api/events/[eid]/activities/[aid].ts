import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { getEvent } from '../index';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventActivity>
) => {
	try {
		const { eid, aid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const activity = await getActivity(event.id, String(aid));

		if (!activity) {
			return res.status(404).send({ error: { message: 'Activity not found.' } });
		}

		return res.status(200).send(activity);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getActivity = async (
	eventId: string,
	aid: string
): Promise<Prisma.EventActivity | null> => {
	return await prisma.eventActivity.findFirst({
		where: {
			eventId: eventId,
			OR: [{ id: aid }, { slug: aid }]
		}
	});
};
