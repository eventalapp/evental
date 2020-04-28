import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateEventPayload } from '../../utils/schemas';

export interface UseCreateEventMutationData {
	createEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		CreateEventPayload
	>;
	createEventError: ServerErrorPayload | null;
}

export const useCreateEventMutation = (): UseCreateEventMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
	const queryClient = useQueryClient();

	const createEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		CreateEventPayload
	>(
		async (data) => {
			const formData = new FormData();

			Object.entries(data).forEach(([key, value]) => {
				if (value.length >= 1 && value instanceof FileList) {
					formData.append(key, value[0], value[0]?.name);
				} else if (value instanceof Date) {
					formData.append(key, value.toISOString());
				} else {
					formData.append(key, value);
				}
			});

			return await axios.post<Prisma.Event>('/api/events/create', formData, {
				onUploadProgress: (progressEvent) => {
					console.log(progressEvent);
				}
			});
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
