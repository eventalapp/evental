import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { InviteRolePayload } from '@eventalapp/shared/utils';

export interface UseInviteRoleData {
	inviteRoleMutation: UseMutationResult<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		InviteRolePayload
	>;
}

export const useInviteRole = (eid: string, rid: string): UseInviteRoleData => {
	const inviteRoleMutation = useMutation<
		Prisma.EventRole,
		AxiosError<ErroredAPIResponse, unknown>,
		InviteRolePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventRole>>(
					`/api/events/${eid}/admin/roles/${rid}/invite`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success(
					`${data.name} invite has been successfully sent. Tell them to check their email.`
				);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { inviteRoleMutation };
};
