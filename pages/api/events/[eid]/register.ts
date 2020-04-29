import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import type Prisma from '@prisma/client';
import { ServerErrorResponse } from '../../../../utils/ServerError';
import { CreateAttendeeSchema } from '../../../../utils/schemas';
import { handleServerError } from '../../../../utils/handleServerError';
import { prisma } from '../../../../prisma/client';
import { getEvent } from './index';
import { processSlug } from '../../../../utils/slugify';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	if (req.method === 'POST') {
		try {
			const { eid } = req.query;

			const session = await getSession({ req });

			if (!session?.user?.id) {
				return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
			}

			const event = await getEvent(String(eid));

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const isAttendeeAlready = await prisma.eventAttendee.findFirst({
				where: {
					eventId: event.id,
					userId: String(session.user.id)
				}
			});

			if (isAttendeeAlready) {
				return res
					.status(401)
					.send({ error: { message: 'You are already attending this event.' } });
			}

			const parsed = CreateAttendeeSchema.parse(req.body);

			const defaultRole = await prisma.eventRole.findFirst({
				where: {
					eventId: event.id,
					defaultRole: true
				}
			});

			if (!defaultRole) {
				return res.status(404).send({ error: { message: 'Role not found.' } });
			}

			const eventAttendee = await prisma.eventAttendee.create({
				data: {
					slug: processSlug(parsed.slug),
					name: parsed.name,
					image: parsed.image,
					company: parsed.company,
					position: parsed.position,
					description: parsed.description,
					eventRoleId: defaultRole?.id,
					userId: session.user.id,
					eventId: event.id,
					permissionRole: 'ATTENDEE'
				}
			});

			if (!eventAttendee) {
				return res.status(500).send({ error: { message: 'Could not create attendee.' } });
			}

			res.status(200).send(eventAttendee);
		} catch (error) {
			return handleServerError(error, res);
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}
};
