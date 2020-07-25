import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { RemoveAttendeeFromSessionPayload } from '@eventalapp/shared/utils';

export interface UseRemoveAttendeeToSessionMutationData {
	removeAttendeeFromSessionMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		RemoveAttendeeFromSessionPayload
	>;
}

export const useDeleteSessionAttendee = (
	eid: string,
	sid: string
): UseRemoveAttendeeToSessionMutationData => {
	const queryClient = useQueryClient();

	const removeAttendeeFromSessionMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		RemoveAttendeeFromSessionPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(
					`/api/events/${eid}/admin/sessions/${sid}/attendees/remove`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully removed this user to this event.');

				void queryClient.invalidateQueries(['role-attendees', eid, sid]);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { removeAttendeeFromSessionMutation };
};
