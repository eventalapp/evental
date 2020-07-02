import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseSessionCategoryQueryData {
	sessionCategory: Prisma.EventSessionCategory | undefined;
	isSessionCategoryLoading: boolean;
	sessionCategoryError: ErroredAPIResponse | null;
}

export const useSessionCategoryQuery = (
	eid: string,
	cid: string,
	initialData?: Prisma.EventSessionCategory | undefined
): UseSessionCategoryQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionCategory, isLoading: isSessionCategoryLoading } = useQuery<
		Prisma.EventSessionCategory,
		AxiosError<ErroredAPIResponse>
	>(
		['session-category', eid, cid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventSessionCategory>>(
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
