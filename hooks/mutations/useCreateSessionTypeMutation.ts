import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateSessionTypePayload } from '../../utils/schemas';

export interface UseCreateSessionTypeMutationData {
	createSessionTypeMutation: UseMutationResult<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionTypePayload
	>;
}

interface UseCreateSessionTypeOptions {
	redirect?: boolean;
}

export const useCreateSessionTypeMutation = (
	eid: string,
	args: UseCreateSessionTypeOptions = {}
): UseCreateSessionTypeMutationData => {
	const { redirect = true } = args;

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

				if (redirect) {
					router.push(`/events/${eid}/admin/sessions/types`).then(() => {
						void queryClient.invalidateQueries(['types', eid]);
					});
				} else {
					void queryClient.invalidateQueries(['types', eid]);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionTypeMutation };
};
