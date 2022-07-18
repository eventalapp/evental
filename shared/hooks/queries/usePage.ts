import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UsePageArgs {
	eid?: string;
	pid?: string;
}

export const usePage = (args: UsePageArgs = {}) => {
	const { eid, pid } = args;

	return useQuery<Prisma.EventPage, ErroredAPIResponse>(
		['page', eid, pid],
		async () => {
			return await api
				.get<SuccessAPIResponse<Prisma.EventPage>>(`/events/${eid}/pages/${pid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(pid)
		}
	);
};
