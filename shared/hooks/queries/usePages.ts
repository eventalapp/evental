import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UsePagesArgs {
	eid?: string;
}

export const usePages = (args: UsePagesArgs = {}) => {
	const { eid } = args;

	return useQuery<Prisma.EventPage[], ErroredAPIResponse>(
		['pages', eid],
		async () => {
			return await api
				.get<SuccessAPIResponse<Prisma.EventPage[]>>(`/events/${eid}/pages`)
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
