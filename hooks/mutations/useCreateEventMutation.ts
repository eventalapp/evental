import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateEventPayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';
import { toast } from 'react-toastify';

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
			const formData = populateFormData(data);

			return await axios.post<Prisma.Event>('/api/events/create', formData);
		},
		{
			onSuccess: (response) => {
				setError(null);

				toast.success('Event created successfully');

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('events');
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { createEventMutation, createEventError: error };
};
