import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateSessionPayload } from '@eventalapp/shared/utils';

export interface UseCreateSessionMutationData {
	createSessionMutation: UseMutationResult<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionPayload
	>;
}

export const useCreateSession = (eid: string): UseCreateSessionMutationData => {
	const queryClient = useQueryClient();

	const createSessionMutation = useMutation<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventSession>>(
					`/api/events/${eid}/admin/sessions/create`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session created successfully');

				router.push(`/events/${eid}/admin/sessions/`).then(() => {
					void queryClient.invalidateQueries('sessions');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionMutation };
};
