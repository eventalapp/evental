import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateEventFormValues } from '../../components/events/CreateEventForm';

export interface UseCreateEventMutationData {
	createEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		CreateEventFormValues
	>;
	createEventError: ServerErrorPayload | null;
}

export const useCreateEventMutation = (): UseCreateEventMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const createEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		CreateEventFormValues
	>(
		async (data) => {
			return await axios.post<Prisma.Event>('/api/events/create', data);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('events');
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { createEventMutation, createEventError: error };
};
