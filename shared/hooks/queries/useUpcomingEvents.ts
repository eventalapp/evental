import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export const useUpcomingEvents = () => {
	return useQuery<Prisma.Event[], ErroredAPIResponse>(
		['upcoming-events'],
		async () => {
			return api
				.get<SuccessAPIResponse<Prisma.Event[]>>(`/events/`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0
		}
	);
};
