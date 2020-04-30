import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditActivityPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse } from 'nextkit';

export interface UseEditActivityMutationData {
	editActivityMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		EditActivityPayload
	>;
}

export const useEditActivityMutation = (eid: string, aid: string): UseEditActivityMutationData => {
	const queryClient = useQueryClient();

	const editActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		EditActivityPayload
	>(
		async (data) => {
			return await axios.put<Prisma.EventActivity>(
				`/api/events/${eid}/admin/activities/${aid}/edit`,
				data
			);
		},
		{
			onSuccess: (response) => {
				toast.success('Activity edited successfully');

				router.push(`/events/${eid}/activities/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['activity', eid, aid]);
					void queryClient.invalidateQueries(['activities', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editActivityMutation };
};
