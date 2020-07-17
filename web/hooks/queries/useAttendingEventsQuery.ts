import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

export interface UseAttendingEventsQueryData {
	attendingEvents: Prisma.Event[] | undefined;
	isAttendingEventsLoading: boolean;
	attendingEventsError: ErroredAPIResponse | null;
}

export const useAttendingEventsQuery = (
	uid: string,
	initialData?: Prisma.Event[]
): UseAttendingEventsQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendingEvents, isLoading: isAttendingEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ErroredAPIResponse>
	>(
		['attending-events', uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<Prisma.Event[]>>(`/api/events/attending`)
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

	return { attendingEvents, isAttendingEventsLoading, attendingEventsError: error };
};
