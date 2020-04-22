import type Prisma from '@prisma/client';

export type EventMemberUser = Prisma.EventMember & {
	user: {
		name: string | null;
		image: string | null;
		company: string | null;
		position: string | null;
	};
};

// export default async (req: NextApiRequest, res: NextApiResponse) => {
// 	const { eid } = req.query;

// 	try {
// 		let attendees = await prisma.eventMember.findMany({
// 			where: {
// 				event: {
// 					OR: [{ id: String(eid) }, { slug: String(eid) }]
// 				},
// 				permissionRole: 'ATTENDEE'
// 			},
// 			include: {
// 				user: {
// 					select: {
// 						name: true,
// 						image: true,
// 						company: true,
// 						position: true
// 					}
// 				}
// 			}
// 		});

// 		let organizers = await prisma.eventMember.findMany({
// 			where: {
// 				event: {
// 					OR: [{ id: String(eid) }, { slug: String(eid) }]
// 				},
// 				OR: [{ permissionRole: 'FOUNDER' }, { permissionRole: 'ORGANIZER' }]
// 			},
// 			include: {
// 				user: {
// 					select: {
// 						name: true,
// 						image: true,
// 						company: true,
// 						position: true
// 					}
// 				}
// 			}
// 		});

// 		if (attendees.length === 0 && organizers.length === 0) {
// 			return res.status(204).end();
// 		}

// 		return res.status(200).send({ attendees, organizers });
// 	} catch (error) {
// 		if (error instanceof Error) {
// 			console.error(error);
// 			return res.status(500).send(error.message);
// 		}

// 		return res.status(500).send('An error occurred, please try again.');
// 	}
// };
