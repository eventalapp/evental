import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export const useSessionsByTypeQuery = (
	eid: string,
	tid: string,
	initialData?: SessionWithVenue[] | undefined
): UseQueryResult<SessionWithVenue[], AxiosError<ErroredAPIResponse>> => {
	return useQuery<SessionWithVenue[], AxiosError<ErroredAPIResponse>>(
		['type-sessions', eid, tid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions?type=${tid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);
};
