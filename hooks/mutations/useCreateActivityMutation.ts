import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateActivityPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateActivityMutationData {
	createActivityMutation: UseMutationResult<
		Prisma.EventActivity,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateActivityPayload
	>;
}

export const useCreateActivityMutation = (eid: string): UseCreateActivityMutationData => {
	const queryClient = useQueryClient();

	const createActivityMutation = useMutation<
		Prisma.EventActivity,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateActivityPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventActivity>>(
					`/api/events/${eid}/admin/activities/create`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Activity created successfully');

				router.push(`/events/${eid}/activities/${data.slug}`).then(() => {
					void queryClient.invalidateQueries('activities');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createActivityMutation };
};
