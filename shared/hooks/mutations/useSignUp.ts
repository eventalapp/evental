import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { SignUpPayload, StrippedUser } from '../../utils';

interface UseSignUpArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: SignUpPayload,
		context: unknown
	) => void;
	onSuccess?: (data: StrippedUser, variables: SignUpPayload, context: unknown) => void;
}

export const useSignUp = (args: UseSignUpArgs = {}) => {
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
