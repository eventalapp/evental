import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { CreateActivityPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';

export interface UseCreateActivityMutationData {
	createActivityMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		CreateActivityPayload
	>;
}

export const useCreateActivityMutation = (eid: string): UseCreateActivityMutationData => {
	const queryClient = useQueryClient();

	const createActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		CreateActivityPayload
	>(
		async (data) => {
			return await axios.post<Prisma.EventActivity>(
				`/api/events/${eid}/admin/activities/create`,
				data
			);
		},
		{
			onSuccess: (response) => {
				toast.success('Activity created successfully');

				router.push(`/events/${eid}/activities/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries('activities');
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { createActivityMutation };
};
