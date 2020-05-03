import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditEventPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { populateFormData } from '../../utils/populateFormData';

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
			const formData = populateFormData(data);

			return await axios
				.put<SuccessAPIResponse<Prisma.Event>>(`/api/events/${eid}/admin/edit`, formData)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Event edited successfully');

				void queryClient.removeQueries(['event', eid]);
				void queryClient.invalidateQueries(['upcoming-events']);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editEventMutation };
};
