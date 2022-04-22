import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../typings/error';

export const useEventsQuery = () => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: events, isLoading: isEventsLoading } = useQuery<
		Prisma.Event[],
		AxiosError<ServerError>
	>(
		['events'],
		async () => {
			return axios.get(`/api/events`).then((res) => res.data);
		},
		{
			retry: 0,
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { events, isEventsLoading, eventsError: error };
};
