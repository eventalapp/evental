import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateRolePayload } from '@eventalapp/shared/utils';

export interface UseCreateRoleMutationData {
	createRoleMutation: UseMutationResult<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateRolePayload
	>;
}

interface UseCreateRoleOptions {
	redirect?: boolean;
}

export const useCreateRole = (
	eid: string,
	args: UseCreateRoleOptions = {}
): UseCreateRoleMutationData => {
	const { redirect = true } = args;

	const queryClient = useQueryClient();

	const createRoleMutation = useMutation<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateRolePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventRole>>(`/api/events/${eid}/admin/roles/create`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Role created successfully');

				if (redirect) {
					router.push(`/events/${eid}/admin/roles/`).then(() => {
						void queryClient.invalidateQueries(['roles', eid]);
					});
				} else {
					void queryClient.invalidateQueries(['roles', eid]);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createRoleMutation };
};
