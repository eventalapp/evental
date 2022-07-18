import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { SignInPayload } from '../../utils/schema';

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;

interface UseSignInMutationArgs {
	redirectUrl?: string;
}

export const useSignInMutation = (args: UseSignInMutationArgs = {}) => {
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
