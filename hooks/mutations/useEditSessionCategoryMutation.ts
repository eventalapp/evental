import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { EditSessionCategoryPayload } from '../../utils/schemas';

export interface UseEditSessionCategoryMutationData {
	editSessionCategoryMutation: UseMutationResult<
		Prisma.EventSessionCategory,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionCategoryPayload
	>;
}

export const useEditSessionCategoryMutation = (
	eid: string,
	cid: string
): UseEditSessionCategoryMutationData => {
	const queryClient = useQueryClient();

	const editSessionCategoryMutation = useMutation<
		Prisma.EventSessionCategory,
		AxiosError<ErroredAPIResponse, unknown>,
		EditSessionCategoryPayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.EventSessionCategory>>(
					`/api/events/${eid}/admin/sessions/categories/${cid}`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session type edited successfully');

				router.push(`/events/${eid}/admin/sessions/categories`).then(() => {
					void queryClient.invalidateQueries(['type', eid, cid]);
					void queryClient.invalidateQueries(['types', eid]);
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editSessionCategoryMutation };
};
