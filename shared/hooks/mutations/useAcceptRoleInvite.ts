import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation } from 'react-query';

import { api } from '../../api';
import { AcceptRoleInvitePayload } from '../../utils';

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
