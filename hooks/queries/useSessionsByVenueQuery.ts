import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export const useSessionsByVenueQuery = (
	eid: string,
	vid: string,
	initialData?: SessionWithVenue[] | undefined
): UseQueryResult<SessionWithVenue[], AxiosError<ErroredAPIResponse>> => {
	return useQuery<SessionWithVenue[], AxiosError<ErroredAPIResponse>>(
		['venue-sessions', eid, vid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions?venue=${vid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);
};
