import { prisma } from '../prisma/client';

export const isOrganizer = async (userId: string, eventId: string) => {
	const event = await prisma.event.findFirst({
		where: {
			OR: [{ id: String(eventId) }, { slug: String(eventId) }]
		}
	});

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
