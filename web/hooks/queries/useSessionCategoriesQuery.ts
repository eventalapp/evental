import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { SessionCategoryWithCount } from '../../pages/api/events/[eid]/sessions/categories';

export interface UseSessionCategoriesQueryData {
	sessionCategories: SessionCategoryWithCount[] | undefined;
	isSessionCategoriesLoading: boolean;
	sessionCategoriesError: ErroredAPIResponse | null;
}

export const useSessionCategoriesQuery = (
	eid: string,
	initialData?: SessionCategoryWithCount[] | undefined
): UseSessionCategoriesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionCategories, isLoading: isSessionCategoriesLoading } = useQuery<
		SessionCategoryWithCount[],
		AxiosError<ErroredAPIResponse>
	>(
		['session-categories', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionCategoryWithCount[]>>(
					`/api/events/${eid}/sessions/categories`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && eid !== '',
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
		sessionCategories,
		isSessionCategoriesLoading,
		sessionCategoriesError: error
	};
};
