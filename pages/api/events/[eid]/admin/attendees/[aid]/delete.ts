import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import { handleServerError } from '../../../../../../../utils/handleServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | string>) => {
	const session = await getSession({ req });
	const { eid, aid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
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

			const attendee = await prisma.eventAttendee.findFirst({
				where: {
					eventId: event.id,
					OR: [{ id: String(aid) }, { slug: String(aid) }]
				},
				select: {
					id: true,
					permissionRole: true
				}
			});

			if (!attendee) {
				return res.status(404).send({ error: { message: 'Attendee not found.' } });
			}

			if (attendee.permissionRole === 'FOUNDER') {
				return res.status(500).send({ error: { message: 'You cannot delete a founder.' } });
			}

			await prisma.eventAttendee.delete({
				where: {
					id: attendee.id
				}
			});

			return res.status(200).send('Attendee deleted.');
		} catch (error) {
			return handleServerError(error, res);
		}
	}

	return res.status(204).end();
};
