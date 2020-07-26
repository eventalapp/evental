import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { StrippedUser } from '../../utils';

interface UseLeaveSessionArgs {
	eid?: string;
	sid?: string;
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: StrippedUser, variables: void, context: unknown) => void;
}

export const useLeaveSession = (args: UseLeaveSessionArgs = {}) => {
	const { eid, sid, onSuccess, onError } = args;

	const queryClient = useQueryClient();

	return useMutation<StrippedUser, ErroredAPIResponse, void>(
		async () => {
			return await api
				.delete<SuccessAPIResponse<StrippedUser>>(`/events/${eid}/sessions/${sid}/leave`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (data, ...rest) => {
				void queryClient.invalidateQueries(['attendees', eid, sid]);
				void queryClient.invalidateQueries(['attendee', eid, sid, data.slug]);
				void queryClient.invalidateQueries(['user-sessions', data.slug]);
				void queryClient.invalidateQueries(['session', eid, sid]);
				void queryClient.invalidateQueries(['isSessionAttendee', eid, sid]);

				onSuccess?.(data, ...rest);
			},
			onError
		}
	);
};
