import { ServerError } from './ServerError';
import { NextApiResponse } from 'next';

export const handleServerError = (error: unknown, res: NextApiResponse) => {
	if (error instanceof ServerError) {
		return res.status(error.statusCode).send({ error: { message: error.message } });
	}

	if (error instanceof Error) {
		console.error(error);
		return res.status(500).send({ error: { message: error.message } });
	}

	return res.status(500).send({ error: { message: 'An error occurred, please try again.' } });
};
