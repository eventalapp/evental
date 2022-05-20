import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsQueryData {
	sessionsData: SessionWithVenue[] | undefined;
	isSessionsLoading: boolean;
	sessionsError: ErroredAPIResponse | null;
}

export interface UseSessionsQueryOptions {
	initialData?: SessionWithVenue[] | undefined;
}

export const useSessionsQuery = (
	eid: string,
	args: UseSessionsQueryOptions = {}
): UseSessionsQueryData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionsData, isLoading: isSessionsLoading } = useQuery<
		SessionWithVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['sessions', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions`)
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
