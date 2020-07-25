import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { AcceptOrganizerInvitePayload } from '../../utils/schema';

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
				.catch((err: AxiosError<ErroredAPIResponse, any>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess,
			onError
		}
	);
};
