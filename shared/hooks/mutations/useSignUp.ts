import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { StrippedUser } from '../../types';
import { SignUpPayload } from '../../utils/schema';

interface UseSignUpOptions {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: SignUpPayload,
		context: unknown
	) => void;
	onSuccess?: (data: StrippedUser, variables: SignUpPayload, context: unknown) => void;
}

export const useSignUp = (args: UseSignUpOptions = {}) => {
	const { onError, onSuccess } = args;
	const queryClient = useQueryClient();

	return useMutation<StrippedUser, ErroredAPIResponse, SignUpPayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<StrippedUser>>(`/auth/signup`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.refetchQueries('user');

				onSuccess?.(...rest);
			},
			onError
		}
	);
};
