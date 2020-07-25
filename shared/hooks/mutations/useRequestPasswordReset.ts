import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation } from 'react-query';

import { api } from '../../api';
import { ChangePasswordRequestPayload } from '../../utils';

interface UseRequestPasswordResetArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: ChangePasswordRequestPayload,
		context: unknown
	) => void;
	onSuccess?: (data: void, variables: ChangePasswordRequestPayload, context: unknown) => void;
}

export const useRequestPasswordReset = (args: UseRequestPasswordResetArgs = {}) => {
	const { onError, onSuccess } = args;

	return useMutation<void, ErroredAPIResponse, ChangePasswordRequestPayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/auth/password/request`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess,
			onError
		}
	);
};
