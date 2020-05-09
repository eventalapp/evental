import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { AcceptRoleInvitePayload } from '../../utils/schemas';
import router from 'next/router';

export interface UseInviteRoleData {
	acceptRoleInviteMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AcceptRoleInvitePayload
	>;
}

export const useAcceptRoleInviteMutation = (eid: string, rid: string): UseInviteRoleData => {
	const acceptRoleInviteMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AcceptRoleInvitePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/events/${eid}/invites/roles/${rid}`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push(`/events/${eid}`).then(() => {
					toast.success('You have joined this event.');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { acceptRoleInviteMutation };
};
