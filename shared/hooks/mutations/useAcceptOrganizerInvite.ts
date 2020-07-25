import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation } from 'react-query';

import { api } from '../../api';
import { AcceptOrganizerInvitePayload } from '../../utils';

interface UseAcceptOrganizerInviteArgs {
	eid?: string;
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: AcceptOrganizerInvitePayload,
		context: unknown
	) => void;
	onSuccess?: (data: void, variables: AcceptOrganizerInvitePayload, context: unknown) => void;
}

export const useAcceptOrganizerInvite = (args: UseAcceptOrganizerInviteArgs = {}) => {
	const { onError, onSuccess, eid } = args;

	return useMutation<void, ErroredAPIResponse, AcceptOrganizerInvitePayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/events/${eid}/invites/organizer`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess,
			onError
		}
	);
};
