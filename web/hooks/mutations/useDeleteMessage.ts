import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseDeleteMessageMutationData {
	deleteMessage: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteMessage = (eid: string, mid: string): UseDeleteMessageMutationData => {
	const queryClient = useQueryClient();

	const deleteMessage = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/messages/${mid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Message deleted successfully');

				router.push(`/events/${eid}/admin/messages`).then(() => {
					void queryClient.invalidateQueries(['messages', eid]);
					void queryClient.invalidateQueries(['message', eid, mid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteMessage };
};
