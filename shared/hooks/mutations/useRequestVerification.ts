import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation } from 'react-query';

import { api } from '../../api';

interface UseRequestVerificationArgs {
	onError?: (error: ErroredAPIResponse | undefined, variables: void, context: unknown) => void;
	onSuccess?: (data: void, variables: void, context: unknown) => void;
}

export const useRequestVerification = (args: UseRequestVerificationArgs = {}) => {
	const { onError, onSuccess } = args;

	return useMutation<void, ErroredAPIResponse, void>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/auth/verify/request`, data)
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
