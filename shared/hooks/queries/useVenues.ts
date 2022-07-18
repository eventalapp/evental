import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseVenuesArgs {
	eid?: string;
}

export const useVenues = (args: UseVenuesArgs = {}) => {
	const { eid } = args;

	return useQuery<Prisma.EventVenue[], ErroredAPIResponse>(
		['venues', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.EventVenue[]>>(`/events/${eid}/venues`)
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
