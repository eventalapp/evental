import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseEventQueryData {
	event: Prisma.Event | undefined;
	isEventLoading: boolean;
	eventError: ServerErrorPayload | null;
}

export const useEventQuery = (eid: string): UseEventQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: event, isLoading: isEventLoading } = useQuery<
		Prisma.Event,
		AxiosError<ServerError>
	>(
		['event', eid],
		async () => {
			return axios.get<Prisma.Event>(`/api/events/${eid}`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { event, isEventLoading, eventError: error };
};
