import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenue } from '../../utils';

export interface UseSessionArgs {
	eid?: string;
	sid?: string;
}

export const useSession = (args: UseSessionArgs = {}) => {
	const { eid, sid } = args;

	return useQuery<SessionWithVenue, ErroredAPIResponse>(
		['session', eid, sid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionWithVenue>>(`/events/${eid}/sessions/${sid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(sid)
		}
	);
};
