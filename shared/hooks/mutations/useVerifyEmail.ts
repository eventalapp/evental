import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { VerifyEmailPayload } from '../../utils';

interface UseVerifyEmailArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: VerifyEmailPayload,
		context: unknown
	) => void;
	onSuccess?: (data: void, variables: VerifyEmailPayload, context: unknown) => void;
}

export const useVerifyEmail = (args: UseVerifyEmailArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<void, ErroredAPIResponse, VerifyEmailPayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<void>>(`/auth/verify`, data)
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
