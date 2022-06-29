import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export type UseLeaveSessionMutationData = UseMutationResult<
	void,
	AxiosError<ErroredAPIResponse, unknown>,
	void
>;

interface UseLeaveSessionOptions {
	redirect?: boolean;
}

export const useLeaveSession = (
	eid: string,
	sid: string,
	uid: string,
	args: UseLeaveSessionOptions = {}
): UseLeaveSessionMutationData => {
	const { redirect = true } = args;

	const queryClient = useQueryClient();

	const invalidate = () => {
		void queryClient.invalidateQueries(['attendees', eid, sid]);
		void queryClient.invalidateQueries(['attendee', eid, sid, uid]);
		void queryClient.invalidateQueries(['user-sessions', uid]);
		void queryClient.invalidateQueries(['session', eid, sid]);
		void queryClient.invalidateQueries(['isSessionAttendee', eid, sid]);
	};

	return useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/sessions/${sid}/attendees/${uid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have left the session');

				if (redirect) {
					router.push(`/events/${eid}`).then(() => {
						invalidate();
					});
				} else {
					invalidate();
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);
};
