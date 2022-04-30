import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseDeleteRoleMutationData {
	deleteRoleMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
		void
	>;
}

export const useDeleteRoleMutation = (eid: string, rid: string): UseDeleteRoleMutationData => {
	const queryClient = useQueryClient();

	const deleteRoleMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
		void
	>(
		async () => {
			return await axios.delete(`/api/events/${eid}/admin/roles/${rid}/delete`);
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
