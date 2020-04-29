import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { FormEvent, useState } from 'react';
import router from 'next/router';
import { toast } from 'react-toastify';

export interface UseDeleteRoleMutationData {
	deleteRoleMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	deleteRoleError: ServerErrorPayload | null;
}

export const useDeleteRoleMutation = (eid: string, rid: string): UseDeleteRoleMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const deleteRoleMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			return await axios.delete(`/api/events/${eid}/admin/roles/${rid}/delete`);
		},
		{
			onSuccess: () => {
				setError(null);

				toast.success('Role deleted successfully');

				router.push(`/events/${eid}/roles`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
					void queryClient.invalidateQueries(['role', eid, rid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			}
		}
	);

	return { deleteRoleMutation, deleteRoleError: error };
};
