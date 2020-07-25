import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditRolePayload } from '@eventalapp/shared/utils';

export interface UseEditRoleMutationData {
	editRoleMutation: UseMutationResult<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		EditRolePayload
	>;
}

export const useEditRole = (eid: string, rid: string): UseEditRoleMutationData => {
	const queryClient = useQueryClient();

	const editRoleMutation = useMutation<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		EditRolePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventRole>>(`/api/events/${eid}/admin/roles/${rid}`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Role edited successfully');

				router.push(`/events/${eid}/admin/roles/${data.slug}`).then(() => {
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
