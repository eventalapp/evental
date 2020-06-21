import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditSessionTypePayload } from '../../utils/schemas';

export interface UseEditSessionTypeMutationData {
	editSessionTypeMutation: UseMutationResult<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionTypePayload
	>;
}

export const useEditSessionTypeMutation = (
	eid: string,
	tid: string
): UseEditSessionTypeMutationData => {
	const queryClient = useQueryClient();

	const editSessionTypeMutation = useMutation<
		Prisma.EventSessionType,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionTypePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventSessionType>>(
					`/api/events/${eid}/admin/sessions/types/${tid}/edit`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session type edited successfully');

				router.push(`/events/${eid}/admin/sessions/types`).then(() => {
					void queryClient.invalidateQueries(['type', eid, tid]);
					void queryClient.invalidateQueries(['types', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editSessionTypeMutation };
};
