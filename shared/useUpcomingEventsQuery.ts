import type Prisma from '@prisma/client';
import { api } from './api';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseUpcomingEventsQueryData {
	upcomingEvents: Prisma.Event[] | undefined;
	isUpcomingEventsLoading: boolean;
	upcomingEventsError: ErroredAPIResponse | null;
}

export const useUpcomingEventsQuery = (
	initialData?: Prisma.Event[]
): UseUpcomingEventsQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: upcomingEvents, isLoading: isUpcomingEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ErroredAPIResponse>
	>(
		['upcoming-events'],
		async () => {
			return api.get<SuccessAPIResponse<Prisma.Event[]>>(`/events/`).then((res) => res.data.data);
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

	return { upcomingEvents, isUpcomingEventsLoading, upcomingEventsError: error };
};
