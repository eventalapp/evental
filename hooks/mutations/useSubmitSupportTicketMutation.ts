import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { SubmitSupportTicketPayload } from '../../utils/schemas';
import { StrippedUser } from '../../utils/stripUser';

export type UseSubmitSupportTicketMutationData = UseMutationResult<
	StrippedUser,
	AxiosError<ErroredAPIResponse, unknown>,
	SubmitSupportTicketPayload
>;

interface UseSubmitSupportTicketMutationOptions {
	redirectUrl?: string;
}

export const useSubmitSupportTicketMutation = (
	args: UseSubmitSupportTicketMutationOptions = {}
): UseSubmitSupportTicketMutationData => {
	const { redirectUrl } = args;

	return useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SubmitSupportTicketPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<StrippedUser>>(`/api/support`, data)
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
