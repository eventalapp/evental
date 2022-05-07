import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseDeleteSessionTypeMutationData {
	deleteSessionTypeMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteSessionTypeMutation = (
	eid: string,
	tid: string
): UseDeleteSessionTypeMutationData => {
	const queryClient = useQueryClient();

	const deleteSessionTypeMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/sessions/types/${tid}/delete`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session deleted successfully');

				router.push(`/events/${eid}/admin/sessions/types`).then(() => {
					void queryClient.invalidateQueries(['type', eid, tid]);
					void queryClient.invalidateQueries(['types', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteSessionTypeMutation };
};
