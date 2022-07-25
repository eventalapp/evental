import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditPagePayload } from '@eventalapp/shared/utils';

export interface UseEditPageMutationData {
	editPageMutation: UseMutationResult<
		Prisma.EventPage,
		AxiosError<ErroredAPIResponse, unknown>,
		EditPagePayload
	>;
}

export const useEditPage = (eid: string, pid: string): UseEditPageMutationData => {
	const queryClient = useQueryClient();

	const editPageMutation = useMutation<
		Prisma.EventPage,
		AxiosError<ErroredAPIResponse, unknown>,
		EditPagePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventPage>>(`/api/events/${eid}/admin/pages/${pid}`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data) => {
				toast.success('Page edited successfully');

				router.push(`/events/${eid}/admin/pages/${data.slug}`).then(() => {
					void queryClient.invalidateQueries(['page', eid, pid]);
					void queryClient.invalidateQueries(['pages']);
					void queryClient.invalidateQueries(['attendees', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editPageMutation };
};
