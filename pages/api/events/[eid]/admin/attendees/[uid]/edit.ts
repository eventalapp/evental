import { EventPermissionRole } from '@prisma/client';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../../../../../prisma/client';
import { api } from '../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { AdminEditAttendeeSchema } from '../../../../../../../utils/schemas';
import {
	AttendeeWithUserInput,
	stripAttendeeWithUserPassword
} from '../../../../../../../utils/stripUserPassword';
import { getAttendee } from '../../../attendees/[uid]';
import { getEvent } from '../../../index';

export default api({
	async PUT({ ctx, req }) {
		const { eid, uid } = req.query;

		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const isOrganizerResponse = await isOrganizer(String(user?.id), String(eid));

		if (!isOrganizerResponse) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const attendee = await getAttendee(String(eid), String(uid));

		if (!attendee) {
			throw new NextkitError(404, 'Attendee not found.');
		}

		const body = AdminEditAttendeeSchema.parse(req.body);

		const requestedPermissionRole =
			EventPermissionRole[body.permissionRole as keyof typeof EventPermissionRole] ??
			EventPermissionRole.ATTENDEE;

		if (!requestedPermissionRole) {
			throw new NextkitError(400, 'Invalid permission role.');
		}

		const requesterAttendee = await prisma.eventAttendee.findFirst({
			where: {
				eventId: event.id,
				userId: user.id
			}
		});

		if (!requesterAttendee) {
			throw new NextkitError(403, 'Cannot find your attendee profile.');
		}

		if (attendee.permissionRole === 'FOUNDER' && requestedPermissionRole !== 'FOUNDER') {
			throw new NextkitError(400, 'The founder role cannot be removed.');
		}

		if (requestedPermissionRole === 'FOUNDER' && attendee.permissionRole !== 'FOUNDER') {
			throw new NextkitError(400, 'Cannot assign the founder permission role.');
		}

		if (!(attendee.permissionRole === 'ORGANIZER' && requestedPermissionRole === 'ORGANIZER')) {
			if (
				requestedPermissionRole === 'ORGANIZER' &&
				requesterAttendee.permissionRole !== 'FOUNDER'
			) {
				throw new NextkitError(400, 'You must be the event founder to assign the organizer role.');
			}
		}

		const editedEventAttendee = await prisma.eventAttendee.update({
			where: {
				id: attendee.id
			},
			data: {
				eventRoleId: body.eventRoleId,
				userId: attendee.userId,
				eventId: attendee.eventId,
				permissionRole: requestedPermissionRole
			},
			select: {
				user: true
			}
		});

		if (!editedEventAttendee) {
			throw new NextkitError(500, 'Could not edit attendee.');
		}

		stripAttendeeWithUserPassword(editedEventAttendee as AttendeeWithUserInput);

		return editedEventAttendee;
	}
});
