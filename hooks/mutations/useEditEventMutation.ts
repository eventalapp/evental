import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditEventPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseEditEventMutationData {
	editEventMutation: UseMutationResult<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventPayload
	>;
}

export const useEditEventMutation = (eid: string): UseEditEventMutationData => {
	const queryClient = useQueryClient();

	const editEventMutation = useMutation<
		Prisma.Event,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventPayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.Event>>(`/api/events/${eid}/admin/edit`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Event edited successfully');

				router.push(`/events/${data.slug}`).then(() => {
					void queryClient.removeQueries(['event', eid]);
					void queryClient.invalidateQueries(['upcoming-events']);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editEventMutation };
};
