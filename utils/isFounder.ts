import prisma from '../prisma/client';

export const isFounder = async (userId: string, eventId: string) => {
	return Boolean(
		await prisma.eventMember.findFirst({
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
