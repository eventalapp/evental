import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { CreateSessionCategoryPayload, SessionCategoryWithCount } from '@eventalapp/shared/utils';

export interface UseCreateSessionCategoryMutationData {
	createSessionCategoryMutation: UseMutationResult<
		SessionCategoryWithCount,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionCategoryPayload
	>;
}

interface UseCreateSessionCategoryOptions {
	redirect?: boolean;
}

export const useCreateSessionCategory = (
	eid: string,
	args: UseCreateSessionCategoryOptions = {}
): UseCreateSessionCategoryMutationData => {
	const { redirect = true } = args;

	const queryClient = useQueryClient();

	const createSessionCategoryMutation = useMutation<
		SessionCategoryWithCount,
		AxiosError<ErroredAPIResponse, unknown>,
		CreateSessionCategoryPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<SessionCategoryWithCount>>(
					`/api/events/${eid}/admin/sessions/categories/create`,
					data
				)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Session category created successfully');

				if (redirect) {
					router.push(`/events/${eid}/admin/sessions/categories`).then(() => {
						void queryClient.invalidateQueries(['session-categories', eid]);
					});
				} else {
					void queryClient.invalidateQueries(['session-categories', eid]);
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { createSessionCategoryMutation };
};
