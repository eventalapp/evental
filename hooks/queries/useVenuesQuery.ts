import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';

export interface UseVenuesQueryData {
	venues: Prisma.EventVenue[] | undefined;
	isVenuesLoading: boolean;
	venuesError: NextkitError | null;
}

export const useVenuesQuery = (
	eid: string,
	initialData?: Prisma.EventVenue[] | undefined
): UseVenuesQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: venues, isLoading: isVenuesLoading } = useQuery<
		Prisma.EventVenue[],
		AxiosError<NextkitError>
	>(
		['venues', eid],
		async () => {
			return axios.get<Prisma.EventVenue[]>(`/api/events/${eid}/venues`).then((res) => res.data);
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

	return { venues, isVenuesLoading, venuesError: error };
};
