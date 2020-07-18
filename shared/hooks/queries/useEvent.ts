import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseEventArgs {
	eid?: string;
}

export const useEvent = (args: UseEventArgs = {}) => {
	const { eid } = args;

	return useQuery<Prisma.Event, ErroredAPIResponse>(
		['event', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.Event>>(`/events/${eid}`)
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
