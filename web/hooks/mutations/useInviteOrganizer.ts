import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { InviteOrganizerPayload } from '@eventalapp/shared/utils';

export interface UseInviteOrganizerData {
	inviteOrganizerMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		InviteOrganizerPayload
	>;
}

export const useInviteOrganizer = (eid: string): UseInviteOrganizerData => {
	const inviteOrganizerMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		InviteOrganizerPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/events/${eid}/admin/organizers/invite`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success(
					'Organizer invite has been successfully sent. Tell them to check their email.'
				);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { inviteOrganizerMutation };
};
