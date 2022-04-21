import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../../prisma/client';
import { isOrganizer } from '../../../../utils/isOrganizer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	try {
		let eventFound = await prisma.event.findFirst({ where: { id: String(eid) } });

		return res
			.status(200)
			.send({ event: eventFound, isOrganizer: isOrganizer(session.user.id, String(eid)) });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
