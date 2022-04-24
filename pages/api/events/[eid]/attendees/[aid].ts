import type Prisma from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/client';

export type EventMemberUser = Prisma.EventMember & {
	user: {
		name: string | null;
		image: string | null;
		company: string | null;
		position: string | null;
	};
	role: {
		name: string | null;
	};
};

export const eventMemberInclude = {
	user: {
		select: {
			name: true,
			image: true,
			company: true,
			position: true
		}
	},
	role: {
		select: {
			name: true
		}
	}
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { eid, aid } = req.query;

	try {
		const event = await prisma.event.findFirst({
			where: {
				OR: [{ id: String(eid) }, { slug: String(eid) }]
			}
		});

		if (!event) {
			return res.status(404).send({ error: { message: 'Event not found.' } });
		}

		const eventMember = await prisma.eventMember.findFirst({
			where: {
				OR: [{ id: String(aid) }, { slug: String(aid) }],
				eventId: event.id
			},
			include: {
				...eventMemberInclude
			}
		});

		if (!eventMember) {
			return res.status(404).send({ error: { message: 'Attendee not found.' } });
		}

		return res.status(200).send(eventMember);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
