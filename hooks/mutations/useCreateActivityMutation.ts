import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateActivityPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseCreateActivityMutationData {
	createActivityMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateActivityPayload
	>;
}

export const useCreateActivityMutation = (eid: string): UseCreateActivityMutationData => {
	const queryClient = useQueryClient();

	const createActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<NextkitError, unknown>,
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
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createActivityMutation };
};
