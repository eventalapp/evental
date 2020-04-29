import { prisma } from '../prisma/client';

export const isFounder = async (userId: string, eid: string) => {
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
