import axios, { AxiosError, AxiosResponse } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';
import router from 'next/router';

export interface UseSignOutMutationData {
	signOutMutation: UseMutationResult<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
		{ callbackUrl?: string } | void
	>;
}

export const useSignOutMutation = (): UseSignOutMutationData => {
	const signOutMutation = useMutation<
		AxiosResponse<unknown, unknown>,
		AxiosError<NextkitError, unknown>,
		{ callbackUrl?: string } | void
	>(
		async (data) => {
			return await axios.post(`/api/auth/signout`, data);
		},
		{
			onSuccess: (data, variables) => {
				void router.push(variables?.callbackUrl || '/');

				toast.success('Successfully signed out');
			},
			onError: (error) => {
				toast.error(error.message ?? 'Failed to sign out.');
			}
		}
	);

	return { signOutMutation };
};
