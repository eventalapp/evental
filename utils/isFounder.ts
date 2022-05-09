import { prisma } from '../prisma/client';

export const isFounder = async (eid: string, userId: string) => {
	return Boolean(
		await prisma.eventAttendee.findFirst({
			where: {
				userId: userId,
				event: {
					OR: [{ id: eid }, { slug: eid }]
				},
				permissionRole: 'FOUNDER'
			}
		})
	);
};
