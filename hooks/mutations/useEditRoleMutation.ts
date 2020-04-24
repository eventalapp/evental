import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditRolePayload, EditRoleSchema } from '../../utils/schemas';
import { ServerError, ServerErrorPayload } from '../../typings/error';

export interface UseEditRoleMutationData {
	editRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
	editRoleError: ServerErrorPayload | null;
}

export const useEditRoleMutation = (eid: string, rid: string): UseEditRoleMutationData => {
	const queryClient = useQueryClient();
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const editRoleMutation = useMutation<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const formEntries = getFormEntries(event);

			const parsed = EditRoleSchema.parse(formEntries);

			const body: EditRolePayload = {
				slug: parsed.slug,
				name: parsed.name
			};

			return await axios.put<Prisma.EventRole>(`/api/events/${eid}/admin/roles/${rid}/edit`, body);
		},
		{
			onSuccess: (response) => {
				setError(null);

				router.push(`/events/${eid}/roles/${response.data.slug}`).then(() => {
					void queryClient.invalidateQueries(['role', eid, rid]);
				});
			},
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			}
		}
	);

	return { editRoleMutation, editRoleError: error };
};
