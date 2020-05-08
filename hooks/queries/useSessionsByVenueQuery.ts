import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedSessionsWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByVenueData {
	sessionsByVenueData: PaginatedSessionsWithVenue | undefined;
	isSessionsByVenueLoading: boolean;
}

export interface UseSessionsByVenueOptions {
	initialData?: PaginatedSessionsWithVenue | undefined;
	page?: number;
}

export const useSessionsByVenueQuery = (
	eid: string,
	vid: string,
	args: UseSessionsByVenueOptions = {}
): UseSessionsByVenueData => {
	const { initialData, page = 1 } = args;

	let params = new URLSearchParams();

	params.append('page', String(page));
	params.append('venue', String(vid));

	const { data: sessionsByVenueData, isLoading: isSessionsByVenueLoading } = useQuery<
		PaginatedSessionsWithVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['venue-sessions', eid, vid, page],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PaginatedSessionsWithVenue>>(
					`/api/events/${eid}/sessions?${params}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByVenueData, isSessionsByVenueLoading };
};
