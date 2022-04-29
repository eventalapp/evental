import type Prisma from '@prisma/client';
import axios, { AxiosError, AxiosResponse } from 'axios';
import router from 'next/router';
import { FormEvent } from 'react';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditRolePayload, EditRoleSchema } from '../../utils/schemas';
import { ServerError } from '../../typings/error';
import { toast } from 'react-toastify';
import { processSlug } from '../../utils/slugify';

export interface UseEditRoleMutationData {
	editRoleMutation: UseMutationResult<
		AxiosResponse<Prisma.EventRole, unknown>,
		AxiosError<ServerError, unknown>,
		FormEvent<HTMLFormElement>
	>;
}

export const useEditRoleMutation = (eid: string, rid: string): UseEditRoleMutationData => {
	const queryClient = useQueryClient();

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
				slug: processSlug(parsed.slug),
				name: parsed.name,
				defaultRole: parsed.defaultRole
			};

			return await axios.put<Prisma.EventRole>(`/api/events/${eid}/admin/roles/${rid}/edit`, body);
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
				toast.error(error.response?.data?.error?.message ?? 'An error has occured.');
			}
		}
	);

	return { editRoleMutation };
};
