import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseDeleteActivityMutationData {
	deleteActivityMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		void
	>;
	deleteActivityError: ServerErrorPayload | null;
}

export const useDeleteActivityMutation = (
	eid: string,
	aid: string
): UseDeleteActivityMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const deleteActivityMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		void
	>(
		async () => {
			return await axios.delete(`/api/events/${eid}/admin/activities/${aid}/delete`);
		},
		{
			onSuccess: () => {
				setError(null);

				toast.success('Activity deleted successfully');

				router.push(`/events/${eid}/activities/`).then(() => {
					void queryClient.invalidateQueries(['activity', eid, aid]);
					void queryClient.invalidateQueries(['activities', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { deleteActivityMutation, deleteActivityError: error };
};
