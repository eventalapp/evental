import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface UseDeleteSessionCategoryMutationData {
	deleteSessionCategoryMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useDeleteSessionCategory = (
	eid: string,
	cid: string
): UseDeleteSessionCategoryMutationData => {
	const queryClient = useQueryClient();

	const deleteSessionCategoryMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/sessions/categories/${cid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Category deleted successfully');

				router.push(`/events/${eid}/admin/sessions/categories`).then(() => {
					void queryClient.invalidateQueries(['type', eid, cid]);
					void queryClient.invalidateQueries(['types', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteSessionCategoryMutation };
};
