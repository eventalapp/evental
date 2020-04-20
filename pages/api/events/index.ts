import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const session = await getSession({ req });

	if (!session?.user?.id) {
		return res.status(401).send({ message: 'You must be logged in to do this.' });
	}

	try {
		let eventsFound = await prisma.event.findMany({ take: 30 });

		return res.status(200).send(eventsFound);
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).send(error.message);
		}

		return res.status(500).send('An error occurred, please try again.');
	}
};
