import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, rid } = req.query;

	// Get all members of a role

	try {
		const role = await prisma.eventRole.findFirst({
			where: {
				OR: [{ id: String(rid) }, { slug: String(rid) }]
			}
		});

		if (!role) {
			return res.status(404).send('Role not found.');
		}

		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send('Event not found.');
		}

		const attendees = await prisma.eventMember.findMany({
			where: {
				eventRoleId: role.id,
				eventId: event.id
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
						company: true,
						position: true
					}
				}
			}
		});

		return res.status(200).send({ attendees, role });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
