import prisma from '../prisma/client';

export const isOrganizer = async (userId: string, eventId: string) => {
	const isOrganizer = Boolean(
		await prisma.eventMember.findFirst({
			where: {
				userId: userId,
				eventId: eventId,
				OR: [{ role: 'FOUNDER' }, { role: 'ORGANIZER' }]
			}
		})
	);

	return isOrganizer;
};
