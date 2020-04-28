import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { isOrganizer } from '../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../utils/ServerError';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | { isOrganizer: boolean }>
) => {
	const session = await getSession({ req });
	const { eid } = req.query;

	if (!session?.user?.id) {
		return res.status(200).send({ isOrganizer: false });
	}

	try {
		return res.status(200).send({ isOrganizer: await isOrganizer(session.user.id, String(eid)) });
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};
