import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseDeleteEventMutationData {
	deleteEventMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteEvent = (eid: string): UseDeleteEventMutationData => {
	const queryClient = useQueryClient();

	const deleteEventMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin`)
				.then((res) => res.data.data);
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
