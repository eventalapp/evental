import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { Alert } from 'react-native';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { api } from '../../api';
import { SignInPayload } from '../../utils/schema';

export type StrippedUser = Omit<Prisma.User, 'password' | 'email' | 'role'>;

export interface UseSignInMutationData {
	signInMutation: UseMutationResult<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>;
}

interface UseSignInMutationOptions {
	redirectUrl?: string;
}

export const useSignInMutation = (args: UseSignInMutationOptions = {}): UseSignInMutationData => {
	const { redirectUrl } = args;

	const queryClient = useQueryClient();

	const signInMutation = useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		SignInPayload
	>(
		async (data) => {
			return await api
				.post<SuccessAPIResponse<StrippedUser>>(`/auth/signin`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				if (!redirectUrl) {
					Alert.alert('Sign In', 'Successful', [{ text: 'OK' }]);
					void queryClient.refetchQueries('user');
				} else {
					Alert.alert('Sign In', 'Successful', [{ text: 'OK' }]);
					void queryClient.refetchQueries('user');
				}
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'Failed to sign in.');
			}
		}
	);

	return { signInMutation };
};
