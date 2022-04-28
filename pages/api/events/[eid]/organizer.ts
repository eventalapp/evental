import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { isOrganizer } from '../../../../utils/isOrganizer';
import { ServerErrorResponse } from '../../../../utils/ServerError';
import { Session } from 'next-auth';
import { handleServerError } from '../../../../utils/handleServerError';

export default async (req: NextApiRequest, res: NextApiResponse<ServerErrorResponse | boolean>) => {
	try {
		const session = await getSession({ req });
		const { eid } = req.query;

		if (!session?.user?.id) {
			return res.status(200).send(false);
		}

		const isOrganizerResponse = await getIsOrganizer(session, String(eid));

		return res.status(200).send(isOrganizerResponse);
	} catch (error) {
		return handleServerError(error, res);
	}
};

export const getIsOrganizer = async (session: Session | null, eid: string): Promise<boolean> => {
	return session ? await isOrganizer(session.user.id, String(eid)) : false;
};
