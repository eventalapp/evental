import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionCategoryWithCount } from '../../types';

export interface UseSessionCategoriesOptions {
	eid?: string;
}

export const useSessionCategories = (args: UseSessionCategoriesOptions = {}) => {
	const { eid } = args;

	return useQuery<SessionCategoryWithCount[], ErroredAPIResponse>(
		['session-categories', eid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionCategoryWithCount[]>>(`/events/${eid}/sessions/categories`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid)
		}
	);
};
