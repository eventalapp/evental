import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByVenueData {
	sessionsByVenueData: SessionWithVenue[] | undefined;
	isSessionsByVenueLoading: boolean;
}

export interface UseSessionsByVenueOptions {
	initialData?: SessionWithVenue[] | undefined;
}

export const useSessionsByVenueQuery = (
	eid: string,
	vid: string,
	args: UseSessionsByVenueOptions = {}
): UseSessionsByVenueData => {
	const { initialData } = args;

	let params = new URLSearchParams();

	params.append('venue', String(vid));

	const { data: sessionsByVenueData, isLoading: isSessionsByVenueLoading } = useQuery<
		SessionWithVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['venue-sessions', eid, vid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions?${params}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && vid !== undefined && vid !== 'undefined',
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByVenueData, isSessionsByVenueLoading };
};
