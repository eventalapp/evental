import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseVenuesQueryData {
	venues: Prisma.EventVenue[] | undefined;
	isVenuesLoading: boolean;
	venuesError: ErroredAPIResponse | null;
}

export const useVenuesQuery = (
	eid: string,
	initialData?: Prisma.EventVenue[] | undefined
): UseVenuesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: venues, isLoading: isVenuesLoading } = useQuery<
		Prisma.EventVenue[],
		AxiosError<ErroredAPIResponse>
	>(
		['venues', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.EventVenue[]>>(`/api/events/${eid}/venues`)
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

	return { venues, isVenuesLoading, venuesError: error };
};
