import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseVenueArgs {
	eid?: string;
	vid?: string;
}

export const useVenue = (args: UseVenueArgs = {}) => {
	const { eid, vid } = args;

	return useQuery<Prisma.EventVenue, ErroredAPIResponse>(
		['venue', eid, vid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.EventVenue>>(`/events/${eid}/venues/${vid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(vid)
		}
	);
};
