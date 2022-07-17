import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { SignInPayload } from '../../utils/schemas';
import { StrippedUser } from '../../utils/user';

export interface UseSignInMutationData {
	signInMutation: UseMutationResult<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>;
}

interface UseSignInMutationOptions {
	redirectUrl?: string;
}

export const useSignInMutation = (args: UseSignInMutationOptions = {}): UseSignInMutationData => {
	const { redirectUrl } = args;

	const queryClient = useQueryClient();

	const signInMutation = useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<StrippedUser>>(`/api/auth/signin`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				if (!redirectUrl) {
					router.push('/events').then(() => {
						toast.success('You have successfully signed in!');
						void queryClient.refetchQueries('user');
					});
				} else {
					router.push(redirectUrl).then(() => {
						toast.success('You have successfully signed in!');
						void queryClient.refetchQueries('user');
					});
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign in.');
			}
		}
	);

	return { signInMutation };
};
