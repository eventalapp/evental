import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { SessionCategoryWithCount } from '../../pages/api/events/[eid]/sessions/categories';

export interface UseSessionCategoryQueryData {
	sessionCategory: SessionCategoryWithCount | undefined;
	isSessionCategoryLoading: boolean;
	sessionCategoryError: ErroredAPIResponse | null;
}

export const useSessionCategoryQuery = (
	eid: string,
	cid: string,
	initialData?: SessionCategoryWithCount | undefined
): UseSessionCategoryQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionCategory, isLoading: isSessionCategoryLoading } = useQuery<
		SessionCategoryWithCount,
		AxiosError<ErroredAPIResponse>
	>(
		['session-category', eid, cid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<SessionCategoryWithCount>>(
					`/api/events/${eid}/sessions/categories/${cid}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				cid !== undefined &&
				cid !== 'undefined' &&
				eid !== '' &&
				cid !== '',
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
		sessionCategory,
		isSessionCategoryLoading,
		sessionCategoryError: error
	};
};
