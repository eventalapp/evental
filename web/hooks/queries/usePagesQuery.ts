import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UsePagesQueryData {
	pages: Prisma.EventPage[] | undefined;
	isPagesLoading: boolean;
	pagesError: ErroredAPIResponse | null;
}

export interface UsePagesQueryOptions {
	initialData?: Prisma.EventPage[] | undefined;
}

export const usePagesQuery = (eid: string, args: UsePagesQueryOptions = {}): UsePagesQueryData => {
	const { initialData } = args;
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: pages, isLoading: isPagesLoading } = useQuery<
		Prisma.EventPage[],
		AxiosError<ErroredAPIResponse>
	>(
		['pages', eid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.EventPage[]>>(`/api/events/${eid}/pages`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { pages, isPagesLoading, pagesError: error };
};
