import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';

export interface UseEventQueryData {
	event: Prisma.Event | null;
	isEventLoading: boolean;
	eventError: NextkitError | null;
}

export const useEventQuery = (
	eid: string,
	initialData?: Prisma.Event | undefined
): UseEventQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: event, isLoading: isEventLoading } = useQuery<
		Prisma.Event,
		AxiosError<NextkitError>
	>(
		['event', eid],
		async () => {
			return axios.get<Prisma.Event>(`/api/events/${eid}`).then((res) => res.data);
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

	return { event: event ?? null, isEventLoading, eventError: error };
};
