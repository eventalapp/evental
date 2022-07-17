import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseOrganizingEventsQueryData {
	organizingEvents: Prisma.Event[] | undefined;
	isOrganizingEventsLoading: boolean;
	organizingEventsError: ErroredAPIResponse | null;
}

export const useOrganizingEventsQuery = (
	uid: string,
	initialData?: Prisma.Event[]
): UseOrganizingEventsQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: organizingEvents, isLoading: isOrganizingEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ErroredAPIResponse>
	>(
		['organizing-events', uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.Event[]>>(`/api/events/organizing`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: uid !== undefined && uid !== 'undefined' && uid !== '',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { organizingEvents, isOrganizingEventsLoading, organizingEventsError: error };
};
