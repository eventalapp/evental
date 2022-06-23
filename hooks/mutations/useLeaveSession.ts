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

export const useLeaveSession = (
	eid: string,
	sid: string,
	uid: string
): UseLeaveSessionMutationData => {
	const queryClient = useQueryClient();

	return useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/sessions/${sid}/attendees/${uid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have left the session');

				router.push(`/events/${eid}`).then(() => {
					void queryClient.invalidateQueries(['attendees', eid, sid]);
					void queryClient.invalidateQueries(['attendee', eid, sid, uid]);
					void queryClient.invalidateQueries(['session', eid, sid]);
					void queryClient.invalidateQueries(['isSessionAttendee', eid, sid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);
};
