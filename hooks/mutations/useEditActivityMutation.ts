import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditActivityPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseEditActivityMutationData {
	editActivityMutation: UseMutationResult<
		Prisma.EventActivity,
		AxiosError<ErroredAPIResponse, unknown>,
		EditActivityPayload
	>;
}

export const useEditActivityMutation = (eid: string, aid: string): UseEditActivityMutationData => {
	const queryClient = useQueryClient();

	const editActivityMutation = useMutation<
		Prisma.EventActivity,
		AxiosError<ErroredAPIResponse, unknown>,
		EditActivityPayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventActivity>>(
					`/api/events/${eid}/admin/activities/${aid}/edit`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Activity edited successfully');

				router.push(`/events/${eid}/activities/${data.slug}`).then(() => {
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
