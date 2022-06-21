import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export type UseLeaveEventMutationData = UseMutationResult<
	void,
	AxiosError<ErroredAPIResponse, unknown>,
	void
>;

export const useLeaveEvent = (eid: string, uid: string): UseLeaveEventMutationData => {
	const queryClient = useQueryClient();

	return useMutation<void, AxiosError<ErroredAPIResponse, unknown>, void>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/events/${eid}/attendees/${uid}`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have left the event');

				router.push(`/events`).then(() => {
					void queryClient.invalidateQueries(['attendee', eid, uid]);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);
};
