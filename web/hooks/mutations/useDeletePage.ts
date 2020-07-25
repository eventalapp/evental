import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseDeletePageMutationData {
	deletePageMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeletePage = (eid: string, pid: string): UseDeletePageMutationData => {
	const queryClient = useQueryClient();

	const deletePageMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/pages/${pid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Page deleted successfully');

				router.push(`/events/${eid}/admin/pages`).then(() => {
					void queryClient.invalidateQueries(['pages', eid]);
					void queryClient.invalidateQueries(['page', eid, pid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deletePageMutation };
};
