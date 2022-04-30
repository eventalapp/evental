import axios, { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { SignInPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';
import { PasswordlessUser } from '../../utils/api';

export interface UseSignInMutationData {
	signInMutation: UseMutationResult<
		AxiosResponse<PasswordlessUser, unknown>,
		AxiosError<NextkitError, unknown>,
		SignInPayload
	>;
}

export const useSignInMutation = (): UseSignInMutationData => {
	const signInMutation = useMutation<
		AxiosResponse<PasswordlessUser, unknown>,
		AxiosError<NextkitError, unknown>,
		SignInPayload
	>(
		async (data) => {
			return await axios.post<PasswordlessUser>(`/api/auth/signin`, data);
		},
		{
			onSuccess: () => {
				toast.success('Successfully signed in');
			},
			onError: (error) => {
				toast.error(error.message ?? 'Failed to sign in.');
			}
		}
	);

	return { signInMutation };
};
