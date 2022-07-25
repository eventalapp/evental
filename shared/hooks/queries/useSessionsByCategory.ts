import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenue } from '../../utils';

export interface UseSessionsByCategoryArgs {
	eid?: string;
	cid?: string;
}

export const useSessionsByCategory = (args: UseSessionsByCategoryArgs = {}) => {
	const { eid, cid } = args;

	let params = new URLSearchParams();

	params.append('category', String(cid));

	return useQuery<SessionWithVenue[], ErroredAPIResponse>(
		['category-sessions', eid, cid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionWithVenue[]>>(`/events/${eid}/sessions?${params.toString()}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(cid)
		}
	);
};
