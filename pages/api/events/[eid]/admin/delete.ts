import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../prisma/client';
import { isFounder } from '../../../../../utils/isFounder';
import { ServerErrorResponse } from '../../../../../utils/ServerError';
import { handleServerError } from '../../../../../utils/handleServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | string>) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isFounder(String(session?.user?.id), String(eid)))) {
		return res
			.status(403)
			.send({ error: { message: 'You must be founder for this event to do this.' } });
	}

	if (req.method === 'DELETE') {
		try {
			const event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			await prisma.event.delete({
				where: { id: event.id }
			});

			return res.status(200).send('Event deleted.');
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
