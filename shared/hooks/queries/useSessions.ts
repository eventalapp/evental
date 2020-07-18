import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenue } from '../../types';

export interface UseSessionsOptions {
	eid?: string;
}

export const useSessions = (args: UseSessionsOptions = {}) => {
	const { eid } = args;

	return useQuery<SessionWithVenue[], ErroredAPIResponse>(
		['sessions', eid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/events/${eid}/sessions`)
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
