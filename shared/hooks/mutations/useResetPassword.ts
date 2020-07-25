import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { ChangePasswordPayload } from '../../utils';

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
