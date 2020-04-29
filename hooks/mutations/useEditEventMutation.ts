import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditEventPayload } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseEditEventMutationData {
	editEventMutation: UseMutationResult<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		EditEventPayload
	>;
}

export const useEditEventMutation = (eid: string): UseEditEventMutationData => {
	const queryClient = useQueryClient();

	const editEventMutation = useMutation<
		AxiosResponse<Prisma.Event, unknown>,
		AxiosError<ServerError, unknown>,
		EditEventPayload
	>(
		async (data) => {
			return await axios.put<Prisma.Event>(`/api/events/${eid}/admin/edit`, data);
		},
		{
			onSuccess: (response) => {
				toast.success('Event edited successfully');

				router.push(`/events/${response.data.slug}`).then(() => {
					void queryClient.removeQueries(['event', eid]);
					void queryClient.invalidateQueries(['events']);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { editEventMutation };
};
