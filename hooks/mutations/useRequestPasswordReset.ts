import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { ChangePasswordRequestPayload } from '../../utils/schemas';

export interface UseRequestPasswordResetData {
	requestPasswordResetMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ChangePasswordRequestPayload
	>;
}

export const useRequestPasswordReset = (): UseRequestPasswordResetData => {
	const requestPasswordResetMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		ChangePasswordRequestPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/auth/password/request`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Password reset request successfully sent. Check your email.');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { requestPasswordResetMutation };
};
