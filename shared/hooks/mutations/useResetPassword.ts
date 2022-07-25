import axios, { AxiosError } from 'axios';
import router from 'next/router';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { ChangePasswordPayload } from '../../utils/schema';

interface UseResetPasswordArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: ChangePasswordPayload,
		context: unknown
	) => void;
	onSuccess?: (data: void, variables: ChangePasswordPayload, context: unknown) => void;
}

export const useResetPassword = (args: UseResetPasswordArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<void, ErroredAPIResponse, ChangePasswordPayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/auth/password/reset`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.invalidateQueries('user');

				onSuccess?.(...rest);
			},
			onError
		}
	);
};
