import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EditVenueSchema } from '../../../../../../../utils/schemas';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid, vid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
	}

	if (!(await isOrganizer(String(session?.user?.id), String(eid)))) {
		return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
	}

	if (req.method === 'PUT') {
		try {
			let bodyParsed = EditVenueSchema.parse(req.body);

			let event = await prisma.event.findFirst({
				where: { OR: [{ id: String(eid) }, { slug: String(eid) }] },
				select: {
					id: true
				}
			});

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			let venue = await prisma.eventVenue.findFirst({
				where: {
					eventId: event.id,
					OR: [{ id: String(vid) }, { slug: String(vid) }]
				},
				select: {
					id: true
				}
			});

			if (!venue) {
				return res.status(404).send({ error: { message: 'Venue not found.' } });
			}

			let editedVenue = await prisma.eventVenue.update({
				where: {
					id: venue.id
				},
				data: {
					slug: bodyParsed.slug,
					name: bodyParsed.name,
					description: bodyParsed.description
				}
			});

			return res.status(200).send(editedVenue);
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);

				return res.status(500).send({ error: { message: error.message } });
			}

			return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
		}
	}

	return res.status(204).end();
};
