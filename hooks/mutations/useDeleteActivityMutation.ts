import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';

export interface UseDeleteActivityMutationData {
	deleteActivityMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		void
	>;
}

export const useDeleteActivityMutation = (
	eid: string,
	aid: string
): UseDeleteActivityMutationData => {
	const queryClient = useQueryClient();

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
				toast.success('Activity deleted successfully');

				router.push(`/events/${eid}/activities/`).then(() => {
					void queryClient.invalidateQueries(['activity', eid, aid]);
					void queryClient.invalidateQueries(['activities', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { deleteActivityMutation };
};
