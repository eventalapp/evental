import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { SessionWithVenue } from '../../types';

export interface UseSessionsByVenueOptions {
	eid?: string;
	vid?: string;
}

export const useSessionsByVenue = (args: UseSessionsByVenueOptions = {}) => {
	const { eid, vid } = args;

	let params = new URLSearchParams();

	params.append('venue', String(vid));

	return useQuery<SessionWithVenue[], AxiosError<ErroredAPIResponse>>(
		['venue-sessions', eid, vid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions?${params}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(vid)
		}
	);
};
