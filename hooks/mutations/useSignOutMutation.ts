import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import router from 'next/router';

export interface UseSignOutMutationData {
	signOutMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		{ callbackUrl?: string } | void
	>;
}

export const useSignOutMutation = (): UseSignOutMutationData => {
	const queryClient = useQueryClient();

	const signOutMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		{ callbackUrl?: string } | void
	>(
		async () => {
			return await axios
				.delete<SuccessAPIResponse<void>>(`/api/auth/signout`)
				.then((res) => res.data.data);
		},
		{
			onSuccess: (data, variables) => {
				void router.push(variables?.callbackUrl || '/');

				void queryClient.invalidateQueries('user');

				toast.success('Successfully signed out');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign out.');
			}
		}
	);

	return { signOutMutation };
};
