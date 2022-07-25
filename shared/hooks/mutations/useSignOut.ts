import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';

interface UseSignOutArgs {
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: void, variables: void, context: unknown) => void;
}

export const useSignOut = (args: UseSignOutArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<void, ErroredAPIResponse, void>(
		async () => {
			return await api
				.delete<SuccessAPIResponse<void>>(`/auth/signout`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.refetchQueries('user');

				router.push('/').then(() => {
					toast.success('You have been signed out');
				});
				onSuccess?.(...rest);
			},
			onError: (error) => {
				toast.error(error.message ?? 'Failed to sign out.');
			}
		}
	);
};
