import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { SignInPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import router from 'next/router';
import { PasswordlessUser } from '../../utils/stripUserPassword';

export interface UseSignInMutationData {
	signInMutation: UseMutationResult<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>;
}

export const useSignInMutation = (): UseSignInMutationData => {
	const queryClient = useQueryClient();

	const signInMutation = useMutation<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<PasswordlessUser>>(`/api/auth/signin`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push('/events').then(() => {
					toast.success('You have successfully signed in!');
					void queryClient.refetchQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign in.');
			}
		}
	);

	return { signInMutation };
};
