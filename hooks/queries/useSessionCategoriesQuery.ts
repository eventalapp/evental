import Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseSessionCategoriesQueryData {
	sessionCategories: Prisma.EventSessionCategory[] | undefined;
	isSessionCategoriesLoading: boolean;
	sessionCategoriesError: ErroredAPIResponse | null;
}

export const useSessionCategoriesQuery = (
	eid: string,
	initialData?: Prisma.EventSessionCategory[] | undefined
): UseSessionCategoriesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: sessionCategories, isLoading: isSessionCategoriesLoading } = useQuery<
		Prisma.EventSessionCategory[],
		AxiosError<ErroredAPIResponse>
	>(
		['session-categories', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventSessionCategory[]>>(
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
