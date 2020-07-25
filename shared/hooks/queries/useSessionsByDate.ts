import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenue } from '../../utils';

export interface UseSessionsByDateArgs {
	eid?: string;
	date?: string;
}

export const useSessionsByDate = (args: UseSessionsByDateArgs = {}) => {
	const { eid, date } = args;

	let params = new URLSearchParams();

	params.append('date', String(date));

	return useQuery<SessionWithVenue[], ErroredAPIResponse>(
		['date-sessions', eid, date],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/events/${eid}/sessions?${params}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(date)
		}
	);
};
