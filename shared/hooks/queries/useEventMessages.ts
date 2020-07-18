import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseEventMessagesArgs {
	eid?: string;
}

export const useEventMessages = (args: UseEventMessagesArgs = {}) => {
	const { eid } = args;

	return useQuery<Prisma.EventMessage[], ErroredAPIResponse>(
		['messages', eid],
		async () => {
			return await api
				.get<SuccessAPIResponse<Prisma.EventMessage[]>>(`/events/${eid}/messages`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid)
		}
	);
};
