import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerError, ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventActivity[]>
) => {
	try {
		const { eid } = req.query;

		const activityList = await getActivities(String(eid));

		return res.status(200).send(activityList);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getActivities = async (eid: string): Promise<Prisma.EventActivity[]> => {
	const event = await getEvent(eid);

	if (!event) {
		throw new ServerError('Event not found.', 404);
	}

	return await prisma.eventActivity.findMany({
		where: {
			eventId: event.id
		}
	});
};
