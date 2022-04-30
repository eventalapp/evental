import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse } from 'nextkit';

export interface UseDeleteEventMutationData {
	deleteEventMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useDeleteEventMutation = (eid: string): UseDeleteEventMutationData => {
	const queryClient = useQueryClient();

	const deleteEventMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async () => {
			return await axios.delete(`/api/events/${eid}/admin/delete`);
		},
		{
			onSuccess: () => {
				toast.success('Event deleted successfully');

				router.push(`/events`).then(() => {
					void queryClient.invalidateQueries(['event', eid]);
					void queryClient.invalidateQueries(['events', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteEventMutation };
};
