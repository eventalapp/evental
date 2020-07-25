import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditEventMessagePayload } from '@eventalapp/shared/utils';

export interface UseEditMessageMutationData {
	editMessage: UseMutationResult<
		Prisma.EventMessage,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventMessagePayload
	>;
}

export const useEditMessage = (eid: string, rid: string): UseEditMessageMutationData => {
	const queryClient = useQueryClient();

	const editMessage = useMutation<
		Prisma.EventMessage,
		AxiosError<ErroredAPIResponse, unknown>,
		EditEventMessagePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventMessage>>(
					`/api/events/${eid}/admin/messages/${rid}`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Message edited successfully');

				router.push(`/events/${eid}/admin/messages/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['message', eid, rid]);
					void queryClient.invalidateQueries(['messages']);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editMessage };
};
