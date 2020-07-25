import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { StrippedUser } from '../../types';
import { SignInPayload } from '../../utils/schema';

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
				.catch((err: AxiosError<ErroredAPIResponse, any>) => {
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
