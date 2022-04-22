import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useEventQuery = (eid: string) => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: event, isLoading: isEventLoading } = useQuery<
		Prisma.Event,
		AxiosError<ServerError>
	>(
		['event', eid],
		async () => {
			return axios.get(`/api/events/${eid}`).then((res) => res.data);
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

	return { event, isEventLoading, eventError: error };
};
