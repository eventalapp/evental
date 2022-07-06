import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { SendEventMessagePayload } from '../../utils/schemas';

export interface UseSendEventMessageData {
	sendEventMessage: UseMutationResult<
		Prisma.EventMessage,
		AxiosError<ErroredAPIResponse, unknown>,
		SendEventMessagePayload
	>;
}

export const useSendEventMessage = (eid: string): UseSendEventMessageData => {
	const queryClient = useQueryClient();

	const sendEventMessage = useMutation<
		Prisma.EventMessage,
		AxiosError<ErroredAPIResponse, unknown>,
		SendEventMessagePayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<Prisma.EventMessage>>(
					`/api/events/${eid}/admin/messages/create`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Page created successfully');

				router.push(`/events/${eid}/admin/messages/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['pages', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { sendEventMessage };
};