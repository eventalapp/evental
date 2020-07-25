import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { StrippedUser } from '../../types';

interface UseLeaveEventOptions {
	eid?: string;
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: StrippedUser, variables: void, context: unknown) => void;
}

export const useLeaveEvent = (args: UseLeaveEventOptions = {}) => {
	const { eid, onSuccess, onError } = args;

	const queryClient = useQueryClient();

	return useMutation<StrippedUser, ErroredAPIResponse, void>(
		async () => {
			return await api
				.delete<SuccessAPIResponse<StrippedUser>>(`/events/${eid}/leave`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (data, ...rest) => {
				void queryClient.invalidateQueries(['attendee', eid, data.slug]);
				void queryClient.invalidateQueries(['attendees', eid]);

				onSuccess?.(data, ...rest);
			},
			onError
		}
	);
};
