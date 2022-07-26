import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';

interface UseEventRegisterArgs {
	eid?: string;
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: Prisma.EventAttendee, variables: void, context: unknown) => void;
}

export const useEventRegister = (args: UseEventRegisterArgs = {}) => {
	const { eid, onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<Prisma.EventAttendee, ErroredAPIResponse, void>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<Prisma.EventAttendee>>(`/events/${eid}/register`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.invalidateQueries(['attendees', eid]);

				onSuccess?.(...rest);
			},
			onError
		}
	);
};
