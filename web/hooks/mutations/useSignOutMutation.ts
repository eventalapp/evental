import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

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
				router.push(variables?.callbackUrl || '/').then(() => {
					toast.success('You have been signed out');
					void queryClient.refetchQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign out.');
			}
		}
	);

	return { signOutMutation };
};
