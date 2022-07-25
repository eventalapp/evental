import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { StrippedUser, SubmitDemoRequestPayload } from '@eventalapp/shared/utils';

export type UseSubmitDemoRequestMutationData = UseMutationResult<
	StrippedUser,
	AxiosError<ErroredAPIResponse, unknown>,
	SubmitDemoRequestPayload
>;

interface UseSubmitDemoRequestMutationOptions {
	redirectUrl?: string;
}

export const useSubmitDemoRequestMutation = (
	args: UseSubmitDemoRequestMutationOptions = {}
): UseSubmitDemoRequestMutationData => {
	const { redirectUrl } = args;

	return useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SubmitDemoRequestPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<StrippedUser>>(`/api/demo`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				if (redirectUrl) {
					router.push(redirectUrl).then(() => {
						toast.success('Your support ticket has been submitted');
					});
				} else {
					toast.success('Your support ticket has been submitted.');
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to submit support ticket.');
			}
		}
	);
};
