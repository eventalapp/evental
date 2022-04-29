import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError } from '../../typings/error';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseCreateRoleMutationData {
	createRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useCreateRoleMutation = (eid: string): UseCreateRoleMutationData => {
	const queryClient = useQueryClient();

	const createRoleMutation = useMutation<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = CreateRoleSchema.parse(formEntries);

			const body: CreateRolePayload = {
				name: parsed.name,
				slug: processSlug(parsed.slug),
				defaultRole: parsed.defaultRole
			};

			return await axios.post<Prisma.EventActivity>(`/api/events/${eid}/admin/roles/create`, body);
		},
		{
			onSuccess: (response) => {
				toast.success('Role created successfully');

				router.push(`/events/${eid}/roles/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
				});
			},
			onError: (error) => {
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { createRoleMutation };
};
