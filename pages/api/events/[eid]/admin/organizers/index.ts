import { api } from '../../../../../../utils/api';
import { getEvent } from '../../index';
import { prisma } from '../../../../../../prisma/client';
import {
	AttendeeWithUser,
	stripAttendeesWithUserPassword
} from '../../../../../../utils/stripUserPassword';
import { NextkitError } from 'nextkit';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
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

	return stripAttendeesWithUserPassword(attendees);
};
