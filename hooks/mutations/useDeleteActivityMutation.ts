import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseDeleteActivityMutationData {
	deleteActivityMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
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
		AxiosError<NextkitError, unknown>,
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
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteActivityMutation };
};
