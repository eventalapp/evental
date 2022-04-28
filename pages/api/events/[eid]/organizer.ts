import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { isOrganizer } from '../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../utils/ServerError';
import { Session } from 'next-auth';

export default async (
	req: NextApiRequest,
	res: NextApiResponse<ServerErrorResponse | { isOrganizer: boolean }>
) => {
	try {
		const session = await getSession({ req });
		const { eid } = req.query;

		if (!session?.user?.id) {
			return res.status(200).send({ isOrganizer: false });
		}

		const isOrganizerResponse = await getIsOrganizer(session, String(eid));

		return res.status(200).send(isOrganizerResponse);
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
			return res.status(500).send({ error: { message: error.message } });
		}

		return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
	}
};

export const getIsOrganizer = async (
	session: Session,
	eid: string
): Promise<{ isOrganizer: boolean }> => {
	return { isOrganizer: await isOrganizer(session.user.id, String(eid)) };
};
