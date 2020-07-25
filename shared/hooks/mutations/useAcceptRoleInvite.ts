import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { AcceptRoleInvitePayload } from '../../utils/schema';

interface UseAcceptRoleInviteArgs {
	eid?: string;
	rid?: string;
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: AcceptRoleInvitePayload,
		context: unknown
	) => void;
	onSuccess?: (data: void, variables: AcceptRoleInvitePayload, context: unknown) => void;
}

export const useAcceptRoleInvite = (args: UseAcceptRoleInviteArgs = {}) => {
	const { eid, rid, onError, onSuccess } = args;

	return useMutation<void, ErroredAPIResponse, AcceptRoleInvitePayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/events/${eid}/invites/roles/${rid}`, data)
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
