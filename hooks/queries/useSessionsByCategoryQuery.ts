import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { SessionWithVenue } from '../../pages/api/events/[eid]/sessions';

export interface UseSessionsByTypeData {
	sessionsByTypeData: SessionWithVenue[] | undefined;
	isSessionsByTypeLoading: boolean;
}

export interface UseSessionsByTypeOptions {
	initialData?: SessionWithVenue[] | undefined;
}

export const useSessionsByCategoryQuery = (
	eid: string,
	cid: string,
	args: UseSessionsByTypeOptions = {}
): UseSessionsByTypeData => {
	const { initialData } = args;

	let params = new URLSearchParams();

	params.append('category', String(cid));

	const { data: sessionsByTypeData, isLoading: isSessionsByTypeLoading } = useQuery<
		SessionWithVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['category-sessions', eid, cid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionWithVenue[]>>(
					`/api/events/${eid}/sessions?${params.toString()}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && cid !== undefined && cid !== 'undefined',
			initialData,
			keepPreviousData: true
		}
	);

	return { sessionsByTypeData, isSessionsByTypeLoading };
};
