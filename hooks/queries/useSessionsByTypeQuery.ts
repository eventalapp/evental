import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedSessionsWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByTypeData {
	sessionsByTypeData: PaginatedSessionsWithVenue | undefined;
	isSessionsByTypeLoading: boolean;
}

export interface UseSessionsByTypeOptions {
	initialData?: PaginatedSessionsWithVenue | undefined;
	page?: number;
}

export const useSessionsByTypeQuery = (
	eid: string,
	tid: string,
	args: UseSessionsByTypeOptions = {}
): UseSessionsByTypeData => {
	const { initialData, page = 1 } = args;

	let params = new URLSearchParams();

	params.append('page', String(page));
	params.append('type', String(tid));

	const { data: sessionsByTypeData, isLoading: isSessionsByTypeLoading } = useQuery<
		PaginatedSessionsWithVenue,
		AxiosError<ErroredAPIResponse>
	>(
		['type-sessions', eid, tid, page],
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
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByTypeData, isSessionsByTypeLoading };
};
