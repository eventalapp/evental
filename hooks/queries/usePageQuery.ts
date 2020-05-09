import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import Prisma from '@prisma/client';

export interface UsePageQueryData {
	page: Prisma.EventPage | undefined;
	isPageLoading: boolean;
	pageError: ErroredAPIResponse | null;
}

export const usePageQuery = (
	eid: string,
	pid: string,
	initialData?: Prisma.EventPage | undefined
): UsePageQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: page, isLoading: isPageLoading } = useQuery<
		Prisma.EventPage,
		AxiosError<ErroredAPIResponse>
	>(
		['page', eid, pid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventPage>>(`/api/events/${eid}/pages/${pid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				pid !== undefined &&
				pid !== 'undefined' &&
				eid !== '' &&
				pid !== '',
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
		page,
		isPageLoading,
		pageError: error
	};
};
