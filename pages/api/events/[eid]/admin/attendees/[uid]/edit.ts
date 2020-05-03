import { prisma } from '../../../../../../../prisma/client';
import { isOrganizer } from '../../../../../../../utils/isOrganizer';
import { EventPermissionRole } from '@prisma/client';
import { getEvent } from '../../../index';
import { getAttendee } from '../../../attendees/[uid]';
import { AdminEditAttendeeSchema } from '../../../../../../../utils/schemas';
import { isFounder } from '../../../../../../../utils/isFounder';
import { api } from '../../../../../../../utils/api';
import { NextkitError } from 'nextkit';
import {
	AttendeeWithUserInput,
	stripAttendeeWithUserPassword
} from '../../../../../../../utils/stripUserPassword';

export default api({
	async PUT({ ctx, req }) {
		const { eid, uid } = req.query;

		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
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

		const parsed = AdminEditAttendeeSchema.parse(req.body);

		const requestedPermissionRole =
			EventPermissionRole[parsed.permissionRole as keyof typeof EventPermissionRole] ??
			EventPermissionRole.ATTENDEE;

		if (!requestedPermissionRole) {
			throw new NextkitError(400, 'Invalid permission role.');
		}

		const isRequesterFounder = await isFounder(String(user?.id), String(eid));

		// If current role is founder and trying to remove it, prevent it

		if (attendee.permissionRole === 'FOUNDER' && requestedPermissionRole !== 'FOUNDER') {
			throw new NextkitError(400, 'The founder role cannot be removed.');
		}

		// Allow founders to edit their self

		if (requestedPermissionRole === 'FOUNDER' && attendee.permissionRole !== 'FOUNDER') {
			throw new NextkitError(400, 'Cannot assign the founder permission role.');
		}

		// Only founders can assign organizer permission role

		if (requestedPermissionRole === 'ORGANIZER' && !isRequesterFounder) {
			throw new NextkitError(400, 'You must be the event founder to assign the organizer role.');
		}

		const editedEventAttendee = await prisma.eventAttendee.update({
			where: {
				id: attendee.id
			},
			data: {
				eventRoleId: parsed.eventRoleId,
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
