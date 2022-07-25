import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { AddAttendeeToSessionPayload } from '@eventalapp/shared/utils';

export interface UseAddAttendeeToSessionMutationData {
	addAttendeeToSessionMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AddAttendeeToSessionPayload
	>;
}

export const useAddAttendeeToSession = (
	eid: string,
	sid: string
): UseAddAttendeeToSessionMutationData => {
	const queryClient = useQueryClient();

	const addAttendeeToSessionMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		AddAttendeeToSessionPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(
					`/api/events/${eid}/admin/sessions/${sid}/attendees/add`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('You have successfully added this user to this event.');

				void queryClient.invalidateQueries(['role-attendees', eid, sid]);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { addAttendeeToSessionMutation };
};
