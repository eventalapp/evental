import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { CreateRolePayload, CreateRoleSchema } from '../../utils/schemas';

export interface UseCreateRoleMutationData {
	createRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventActivity, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	createRoleError: ServerErrorPayload | null;
}

export const useCreateRoleMutation = (eid: string): UseCreateRoleMutationData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);
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
				slug: parsed.slug,
				defaultRole: parsed.defaultRole
			};

			return await axios.post<Prisma.EventActivity>(`/api/events/${eid}/admin/roles/create`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/roles/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['roles', eid]);
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { createRoleMutation, createRoleError: error };
};
