import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../../../../utils/ServerError';
import Prisma, { EventPermissionRole } from '@prisma/client';
import { handleServerError } from '../../../../../../../utils/handleServerError';
import { processSlug } from '../../../../../../../utils/slugify';
import { getEvent } from '../../../index';
import { busboyParseForm } from '../../../../../../../utils/busboyParseForm';
import { getAttendee } from '../../../attendees/[aid]';
import { AdminEditAttendeeSchema } from '../../../../../../../utils/schemas';
import { isFounder } from '../../../../../../../utils/isFounder';

export const config = {
	api: {
		bodyParser: false
	}
};

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | Prisma.EventAttendee>
) => {
	if (req.method === 'PUT') {
		try {
			const { eid, aid } = req.query;

			const session = await getSession({ req });

			if (!session?.user?.id) {
				return res.status(401).send({ error: { message: 'You must be logged in to do this.' } });
			}

			const isOrganizerResponse = await isOrganizer(String(session?.user?.id), String(eid));

			if (!isOrganizerResponse) {
				return res.status(403).send({ error: { message: 'You must be an organizer to do this.' } });
			}

			const event = await getEvent(String(eid));

			if (!event) {
				return res.status(404).send({ error: { message: 'Event not found.' } });
			}

			const attendee = await getAttendee(String(eid), String(aid));

			if (!attendee) {
				return res.status(404).send({ error: { message: 'Attendee not found.' } });
			}

			const { buffer, formData, mimeType } = await busboyParseForm(req);
			const parsed = AdminEditAttendeeSchema.parse(formData);

			const requestedPermissionRole =
				EventPermissionRole[parsed.permissionRole as keyof typeof EventPermissionRole];

			if (!requestedPermissionRole) {
				return res.status(400).send({ error: { message: 'Invalid permission role.' } });
			}

			const isRequesterFounder = await isFounder(String(session?.user?.id), String(eid));
			const isAttendeeFounder = await isFounder(String(attendee.userId), String(eid));

			// If current role is founder and trying to remove it, prevent it

			if (attendee.permissionRole === 'FOUNDER' && requestedPermissionRole !== 'FOUNDER') {
				return res.status(400).send({
					error: { message: 'The founder role cannot be removed.' }
				});
			}

			// Allow founders to edit their self

			if (requestedPermissionRole === 'FOUNDER' && attendee.permissionRole !== 'FOUNDER') {
				return res
					.status(400)
					.send({ error: { message: 'Cannot assign founder permission role.' } });
			}

			// Only founders can assign organizer permission role

			if (requestedPermissionRole === 'ORGANIZER' && !isRequesterFounder) {
				return res.status(400).send({
					error: { message: 'You must be the event founder to assign the organizer role.' }
				});
			}

			const editedEventAttendee = await prisma.eventAttendee.update({
				where: {
					id: attendee.id
				},
				data: {
					slug: processSlug(parsed.slug),
					name: parsed.name,
					image: parsed.image,
					location: parsed.location,
					company: parsed.company,
					position: parsed.position,
					description: parsed.description,
					eventRoleId: parsed.eventRoleId,
					userId: attendee.userId,
					eventId: attendee.eventId,
					permissionRole: requestedPermissionRole
				}
			});

			if (!editedEventAttendee) {
				return res.status(500).send({ error: { message: 'Could not edit attendee.' } });
			}

			res.status(200).send(editedEventAttendee);
		} catch (error) {
			return handleServerError(error, res);
		}
	} else {
		return res.status(405).send({ error: { message: 'Method not allowed' } });
	}

	return res.status(204).end();
};
