import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditActivityPayload } from '../../utils/schemas';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseEditActivityMutationData {
	editActivityMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		EditActivityPayload
	>;
	editActivityError: ServerErrorPayload | null;
}

export const useEditActivityMutation = (eid: string, aid: string): UseEditActivityMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const editActivityMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
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
				setError(null);

				toast.success('Activity edited successfully');

				router.push(`/events/${eid}/activities/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['activity', eid, aid]);
					void queryClient.invalidateQueries(['activities', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { editActivityMutation, editActivityError: error };
};
