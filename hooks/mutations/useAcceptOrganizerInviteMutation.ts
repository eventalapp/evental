import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { AcceptOrganizerInvitePayload } from '../../utils/schemas';
import router from 'next/router';

export interface UseInviteOrganizerData {
	acceptOrganizerInviteMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AcceptOrganizerInvitePayload
	>;
}

export const useAcceptOrganizerInviteMutation = (eid: string): UseInviteOrganizerData => {
	const acceptOrganizerInviteMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AcceptOrganizerInvitePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/events/${eid}/invites/organizer`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push(`/events/${eid}/admin`).then(() => {
					toast.success('You have joined this event as an organizer.');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { acceptOrganizerInviteMutation };
};
