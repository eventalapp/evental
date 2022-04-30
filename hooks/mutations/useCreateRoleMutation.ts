import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateRolePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseCreateRoleMutationData {
	createRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateRolePayload
	>;
}

export const useCreateRoleMutation = (eid: string): UseCreateRoleMutationData => {
	const queryClient = useQueryClient();

	const createRoleMutation = useMutation<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<NextkitError, unknown>,
		CreateRolePayload
	>(
		async (data) => {
			return await axios.post<Prisma.EventRole>(`/api/events/${eid}/admin/roles/create`, data);
		},
		{
			onSuccess: (response) => {
				toast.success('Role created successfully');

				router.push(`/events/${eid}/roles/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.message ?? 'An error has occurred.');
			}
		}
	);

	return { createRoleMutation };
};
