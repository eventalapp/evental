import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { SignInPayload, StrippedUser } from '../../utils';

interface UseSignInArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: SignInPayload,
		context: unknown
	) => void;
	onSuccess?: (data: StrippedUser, variables: SignInPayload, context: unknown) => void;
}

export const useSignIn = (args: UseSignInArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<StrippedUser, ErroredAPIResponse | undefined, SignInPayload>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<StrippedUser>>(`/auth/signin`, data)
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
