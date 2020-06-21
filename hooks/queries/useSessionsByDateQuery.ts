import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByDateData {
	sessionsByDateData: SessionWithVenue[] | undefined;
	isSessionsByDateLoading: boolean;
}

export interface UseSessionsByDateOptions {
	initialData?: SessionWithVenue[] | undefined;
}

export const useSessionsByDateQuery = (
	eid: string,
	date: string,
	args: UseSessionsByDateOptions = {}
): UseSessionsByDateData => {
	const { initialData } = args;

	let params = new URLSearchParams();

	params.append('date', String(date));

	const { data: sessionsByDateData, isLoading: isSessionsByDateLoading } = useQuery<
		SessionWithVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['date-sessions', eid, date],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/api/events/${eid}/sessions?${params}`)
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
