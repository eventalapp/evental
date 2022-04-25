import prisma from '../prisma/client';

export const isOrganizer = async (userId: string, eventId: string) => {
	return Boolean(
		await prisma.eventAttendee.findFirst({
			where: {
				userId: userId,
				event: {
					OR: [{ id: eventId }, { slug: eventId }]
				},
				OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
			}
		})
	);
};
