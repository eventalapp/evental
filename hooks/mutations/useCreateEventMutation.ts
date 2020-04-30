import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateEventPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseCreateEventMutationData {
	createEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateEventPayload
	>;
}

export const useCreateEventMutation = (): UseCreateEventMutationData => {
	const queryClient = useQueryClient();

	const createEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateEventPayload
	>(
		async (data) => {
			return await axios.post<Prisma.Event>('/api/events/create', data);
		},
		{
			onSuccess: (response) => {
				toast.success('Event created successfully');

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('events');
				});
			},
			onError: (error) => {
				toast.error(error.message ?? 'An error has occurred.');
			}
		}
	);

	return { createEventMutation };
};
