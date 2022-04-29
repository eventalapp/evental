import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { CreateEventPayload } from '../../utils/schemas';
import { populateFormData } from '../../utils/populateFormData';
import { toast } from 'react-toastify';

export interface UseCreateEventMutationData {
	createEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		CreateEventPayload
	>;
}

export const useCreateEventMutation = (): UseCreateEventMutationData => {
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
				toast.success('Event created successfully');

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('events');
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { createEventMutation };
};
