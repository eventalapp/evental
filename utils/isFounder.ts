import { prisma } from '../prisma/client';

export const isFounder = async (userId: string, eventId: string) => {
	return Boolean(
		await prisma.eventAttendee.findFirst({
			where: {
				userId: userId,
				event: {
					OR: [{ id: eventId }, { slug: eventId }]
				},
				permissionRole: 'FOUNDER'
			}
		})
	);
};
