import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateRolePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateRoleMutationData {
	createRoleMutation: UseMutationResult<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateRolePayload
	>;
}

export const useCreateRoleMutation = (eid: string): UseCreateRoleMutationData => {
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
			onSuccess: (data) => {
				toast.success('Role created successfully');

				router.push(`/events/${eid}/admin/roles/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createRoleMutation };
};
