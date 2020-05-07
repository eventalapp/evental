import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { CreateSessionTypePayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';

export interface UseCreateSessionTypeMutationData {
	createSessionTypeMutation: UseMutationResult<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionTypePayload
	>;
}

export const useCreateSessionTypeMutation = (eid: string): UseCreateSessionTypeMutationData => {
	const queryClient = useQueryClient();

	const createSessionTypeMutation = useMutation<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionTypePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventSessionType>>(
					`/api/events/${eid}/admin/sessions/types/create`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session type created successfully');

				router.push(`/events/${eid}/admin/sessions/types`).then(() => {
					void queryClient.invalidateQueries('types');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionTypeMutation };
};
