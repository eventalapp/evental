import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseEventMessageArgs {
	eid?: string;
	mid?: string;
}

export const useEventMessage = (args: UseEventMessageArgs = {}) => {
	const { eid, mid } = args;

	return useQuery<Prisma.EventMessage, ErroredAPIResponse>(
		['message', eid, mid],
		async () => {
			return await api
				.get<SuccessAPIResponse<Prisma.EventMessage>>(`/events/${eid}/messages/${mid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(mid)
		}
	);
};
