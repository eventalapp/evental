import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { VerifyEmailPayload } from '../../utils/schemas';
import router from 'next/router';

export interface UseVerifyEmailData {
	verifyEmailMutation: UseMutationResult<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		VerifyEmailPayload
	>;
}

export const useVerifyEmail = (): UseVerifyEmailData => {
	const queryClient = useQueryClient();

	const verifyEmailMutation = useMutation<
		void,
		AxiosError<ErroredAPIResponse, unknown>,
		VerifyEmailPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<void>>(`/api/auth/verify`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push('/').then(() => {
					toast.success('Your email has been verified.');
					void queryClient.invalidateQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { verifyEmailMutation };
};
