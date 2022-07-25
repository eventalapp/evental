import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { AttendeeWithUser, stripAttendeesWithUser } from '@eventalapp/shared/utils';

import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		const organizers = await getOrganizers(String(eid));

		if (!organizers) {
			throw new NextkitError(404, 'No organizers found');
		}

		return organizers;
	}
});

export const getOrganizers = async (eid: string): Promise<AttendeeWithUser[] | null> => {
	const event = await getEvent(eid);

	if (!event) {
		return null;
	}

	const attendees = await prisma.eventAttendee.findMany({
		where: {
			eventId: event.id,
			OR: [{ permissionRole: 'ORGANIZER' }, { permissionRole: 'FOUNDER' }]
		},
		include: {
			user: true,
			role: true
		}
	});

	return stripAttendeesWithUser(attendees);
};
