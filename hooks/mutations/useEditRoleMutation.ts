import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditRolePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseEditRoleMutationData {
	editRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<NextkitError, unknown>,
		EditRolePayload
	>;
}

export const useEditRoleMutation = (eid: string, rid: string): UseEditRoleMutationData => {
	const queryClient = useQueryClient();

	const editRoleMutation = useMutation<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<NextkitError, unknown>,
		EditRolePayload
	>(
		async (data) => {
			return await axios.put<Prisma.EventRole>(`/api/events/${eid}/admin/roles/${rid}/edit`, data);
		},
		{
			onSuccess: (response) => {
				toast.success('Role edited successfully');

				router.push(`/events/${eid}/roles/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['role', eid, rid]);
					void queryClient.invalidateQueries(['roles']);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editRoleMutation };
};
