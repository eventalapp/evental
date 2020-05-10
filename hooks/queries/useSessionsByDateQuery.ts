import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedSessionsWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByDateData {
	sessionsByDateData: PaginatedSessionsWithVenue | undefined;
	isSessionsByDateLoading: boolean;
}

export interface UseSessionsByDateOptions {
	initialData?: PaginatedSessionsWithVenue | undefined;
	page?: number;
}

export const useSessionsByDateQuery = (
	eid: string,
	date: string,
	args: UseSessionsByDateOptions = {}
): UseSessionsByDateData => {
	const { initialData, page = 1 } = args;

	let params = new URLSearchParams();

	params.append('page', String(page));
	params.append('date', String(date));

	const { data: sessionsByDateData, isLoading: isSessionsByDateLoading } = useQuery<
		PaginatedSessionsWithVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['date-sessions', eid, date, page],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PaginatedSessionsWithVenue>>(
					`/api/events/${eid}/sessions?${params}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined && eid !== 'undefined' && date !== undefined && date !== 'undefined',
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByDateData, isSessionsByDateLoading };
};
