import { prisma } from '../prisma/client';
import { getEvent } from '../pages/api/events/[eid]';

export const isOrganizer = async (userId: string, eventId: string) => {
	const event = await getEvent(String(eventId));

	if (!event) {
		return false;
	}

	const attendee = await prisma.eventAttendee.findFirst({
		where: {
			userId: userId,
			event: {
				id: event.id
			},
			OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
		}
	});

	if (!attendee) {
		return false;
	}

	return Boolean(attendee);
};
