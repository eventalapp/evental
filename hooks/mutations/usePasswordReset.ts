import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { ChangePasswordPayload } from '../../utils/schemas';

export interface UsePasswordResetData {
	passwordResetMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ChangePasswordPayload
	>;
}

export const usePasswordReset = (): UsePasswordResetData => {
	const queryClient = useQueryClient();

	const passwordResetMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ChangePasswordPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/auth/password/reset`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push('/').then(() => {
					toast.success('Your password has been reset.');
					void queryClient.invalidateQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { passwordResetMutation };
};
