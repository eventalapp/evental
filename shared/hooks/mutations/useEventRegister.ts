import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';

interface UseEventRegisterOptions {
	eid?: string;
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: Prisma.EventAttendee, variables: void, context: unknown) => void;
}

export const useEventRegister = (args: UseEventRegisterOptions = {}) => {
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
