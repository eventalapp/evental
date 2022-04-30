import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse } from 'nextkit';

export interface UseEventsQueryData {
	events: Prisma.Event[] | undefined;
	isEventsLoading: boolean;
	eventsError: ErroredAPIResponse | null;
}

export const useEventsQuery = (initialData?: Prisma.Event[]): UseEventsQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: events, isLoading: isEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ErroredAPIResponse>
	>(
		['events'],
		async () => {
			return axios.get<Prisma.Event[]>(`/api/events`).then((res) => res.data);
		},
		{
			retry: 0,
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { events, isEventsLoading, eventsError: error };
};
