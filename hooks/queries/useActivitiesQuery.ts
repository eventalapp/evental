import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse } from 'nextkit';

export interface UseActivitiesQueryData {
	activities: Prisma.EventActivity[] | undefined;
	isActivitiesLoading: boolean;
	activitiesError: ErroredAPIResponse | null;
}

export const useActivitiesQuery = (
	eid: string,
	initialData?: Prisma.EventActivity[] | undefined
): UseActivitiesQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: activities, isLoading: isActivitiesLoading } = useQuery<
		Prisma.EventActivity[],
		AxiosError<ErroredAPIResponse>
	>(
		['activities', eid],
		async () => {
			return await axios
				.get<Prisma.EventActivity[]>(`/api/events/${eid}/activities`)
				.then((res) => res.data);
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

	return { activities, isActivitiesLoading, activitiesError: error };
};
