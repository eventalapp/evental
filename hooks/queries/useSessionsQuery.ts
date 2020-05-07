import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedSessionsWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsQueryData {
	sessionsData: PaginatedSessionsWithVenue | undefined;
	isSessionsLoading: boolean;
	sessionsError: ErroredAPIResponse | null;
}

export interface UseSessionsQueryOptions {
	initialData?: PaginatedSessionsWithVenue | undefined;
	page?: number;
}

export const useSessionsQuery = (
	eid: string,
	args: UseSessionsQueryOptions = {}
): UseSessionsQueryData => {
	const { initialData, page = 1 } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	let params = new URLSearchParams();

	params.append('page', String(page));

	const { data: sessionsData, isLoading: isSessionsLoading } = useQuery<
		PaginatedSessionsWithVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['sessions', eid, page],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PaginatedSessionsWithVenue>>(
					`/api/events/${eid}/sessions?${params.toString()}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsData, isSessionsLoading, sessionsError: error };
};
