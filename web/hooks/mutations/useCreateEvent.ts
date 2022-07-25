import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateEventPayload } from '@eventalapp/shared/utils';

export interface UseCreateEventMutationData {
	createEventMutation: UseMutationResult<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateEventPayload
	>;
}

export const useCreateEvent = (): UseCreateEventMutationData => {
	const queryClient = useQueryClient();

	const createEventMutation = useMutation<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateEventPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.Event>>('/api/events/create', data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Event created successfully');

				router.push(`/events/${data.slug}/`).then(() => {
					void queryClient.invalidateQueries('events');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createEventMutation };
};
