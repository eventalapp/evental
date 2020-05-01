import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateSessionPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateSessionMutationData {
	createSessionMutation: UseMutationResult<
		Prisma.EventSession,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionPayload
	>;
}

export const useCreateSessionMutation = (eid: string): UseCreateSessionMutationData => {
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
			onSuccess: (data) => {
				toast.success('Session created successfully');

				router.push(`/events/${eid}/sessions/${data.slug}`).then(() => {
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
