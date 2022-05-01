import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseDeleteRoleMutationData {
	deleteRoleMutation: UseMutationResult<void, AxiosError<ErroredAPIResponse, unknown>, void>;
}

export const useDeleteRoleMutation = (eid: string, rid: string): UseDeleteRoleMutationData => {
	const queryClient = useQueryClient();

	const deleteRoleMutation = useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/roles/${rid}/delete`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Role deleted successfully');

				router.push(`/events/${eid}/roles`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
					void queryClient.invalidateQueries(['role', eid, rid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { deleteRoleMutation };
};
