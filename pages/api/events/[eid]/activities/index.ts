import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { getEvent } from '../index';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventActivity[]>
) => {
	try {
		const { eid } = req.query;

		const event = await getEvent(String(eid));

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const activityList = await getActivities(event.id);

		return res.status(200).send(activityList);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getActivities = async (eventId: string): Promise<Prisma.EventActivity[]> => {
	return await prisma.eventActivity.findMany({
		where: {
			eventId: eventId
		}
	});
};
