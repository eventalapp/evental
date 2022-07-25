import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreatePagePayload } from '@eventalapp/shared/utils';

export interface UseCreatePageMutationData {
	createPageMutation: UseMutationResult<
		Prisma.EventPage,
		AxiosError<ErroredAPIResponse, unknown>,
		CreatePagePayload
	>;
}

export const useCreatePage = (eid: string): UseCreatePageMutationData => {
	const queryClient = useQueryClient();

	const createPageMutation = useMutation<
		Prisma.EventPage,
		AxiosError<ErroredAPIResponse, unknown>,
		CreatePagePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventPage>>(`/api/events/${eid}/admin/pages/create`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Page created successfully');

				router.push(`/events/${eid}/admin/pages/`).then(() => {
					void queryClient.invalidateQueries(['pages', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createPageMutation };
};
