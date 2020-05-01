import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import router from 'next/router';
import { PasswordlessUser } from '../../utils/api';
import { SignUpPayload } from '../../utils/schemas';

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
				void router.push('/events');

				void queryClient.invalidateQueries('user');

				toast.success('Successfully signed up!');
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign up.');
			}
		}
	);

	return { signUpMutation };
};
