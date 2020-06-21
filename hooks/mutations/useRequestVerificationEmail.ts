import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface UseRequestVerificationEmailData {
	requestVerificationEmailMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>;
}

export const useRequestVerificationEmail = (): UseRequestVerificationEmailData => {
	const requestVerificationEmailMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		void
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/auth/verify/request`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Verification request successfully sent. Check your email.');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { requestVerificationEmailMutation };
};
