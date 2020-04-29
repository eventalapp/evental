import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../prisma/client';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import Prisma from '@prisma/client';
import { getEvent } from '../index';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventActivity>
) => {
	try {
		const { eid, aid } = req.query;

		const activity = await getActivity(String(eid), String(aid));

		if (!activity) {
			return res.status(404).send({ error: { message: 'Activity not found.' } });
		}

		return res.status(200).send(activity);
	} catch (error) {
		return handleServerError(error, res);
	}
};

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
