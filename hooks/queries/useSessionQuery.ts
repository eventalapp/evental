import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionQueryData {
	session: SessionWithVenue | undefined;
	isSessionLoading: boolean;
	sessionError: ErroredAPIResponse | null;
}

export const useSessionQuery = (
	eid: string,
	sid: string,
	initialData?: SessionWithVenue | undefined
): UseSessionQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: session, isLoading: isSessionLoading } = useQuery<
		SessionWithVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['session', eid, sid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue>>(`/api/events/${eid}/sessions/${sid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				sid !== undefined &&
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return {
		session,
		isSessionLoading,
		sessionError: error
	};
};
