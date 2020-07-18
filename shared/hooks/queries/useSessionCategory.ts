import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionCategoryWithCount } from '../../types';

export interface UseSessionsCategoryOptions {
	eid?: string;
	cid?: string;
}

export const useSessionCategory = (args: UseSessionsCategoryOptions = {}) => {
	const { eid, cid } = args;

	return useQuery<SessionCategoryWithCount, ErroredAPIResponse>(
		['session-category', eid, cid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionCategoryWithCount>>(
					`/events/${eid}/sessions/categories/${cid}`
				)
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
