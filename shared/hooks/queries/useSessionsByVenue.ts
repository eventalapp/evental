import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenue } from '../../utils';

export interface UseSessionsByVenueArgs {
	eid?: string;
	vid?: string;
}

export const useSessionsByVenue = (args: UseSessionsByVenueArgs = {}) => {
	const { eid, vid } = args;

	let params = new URLSearchParams();

	params.append('venue', String(vid));

	return useQuery<SessionWithVenue[], ErroredAPIResponse>(
		['venue-sessions', eid, vid],
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
			enabled: Boolean(eid) && Boolean(vid)
		}
	);
};
