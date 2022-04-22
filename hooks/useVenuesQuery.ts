import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useVenuesQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: venues, isLoading: isVenuesLoading } = useQuery<
		Prisma.EventVenue[],
		AxiosError<ServerError>
	>(
		['venues', eid],
		async () => {
			return axios.get(`/api/events/${eid}/venues`).then((res) => res.data);
		},
		{
			retry: 1,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { venues, isVenuesLoading, venuesError: error };
};
