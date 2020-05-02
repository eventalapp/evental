import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import router from 'next/router';
import { SignUpPayload } from '../../utils/schemas';
import { PasswordlessUser } from '../../utils/stripUserPassword';

export interface UseSignUpMutationData {
	signUpMutation: UseMutationResult<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignUpPayload
	>;
}

export const useSignUpMutation = (): UseSignUpMutationData => {
	const queryClient = useQueryClient();

	const signUpMutation = useMutation<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignUpPayload
	>(
		async (data) => {
			return await axios
				.post<SuccessAPIResponse<PasswordlessUser>>(`/api/auth/signup`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				router.push('/events').then(() => {
					toast.success('You have successfully signed up');
					void queryClient.refetchQueries('user');
				});
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign up.');
			}
		}
	);

	return { signUpMutation };
};
