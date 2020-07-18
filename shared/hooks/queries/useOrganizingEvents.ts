import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseOrganizingEventsArgs {
	uid?: string;
}

export const useOrganizingEvents = (args: UseOrganizingEventsArgs = {}) => {
	const { uid } = args;

	return useQuery<Prisma.Event[], ErroredAPIResponse>(
		['organizing-events', uid],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.Event[]>>(`/events/organizing`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(uid)
		}
	);
};
