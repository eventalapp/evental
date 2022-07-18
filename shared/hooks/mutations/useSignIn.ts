import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { StrippedUser } from '../../types';
import { SignInPayload } from '../../utils/schema';

interface UseSignInArgs {
	redirectUrl?: string;
}

export const useSignIn = (args: UseSignInArgs = {}) => {
	const { redirectUrl } = args;

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
			onSuccess: () => {
				Alert.alert('Sign In', 'Successful', [{ text: 'OK' }]);
				void queryClient.refetchQueries('user');
			},
			onError: (error) => {
				Alert.alert('Error', error?.message, [{ text: 'OK' }]);
			}
		}
	);
};
