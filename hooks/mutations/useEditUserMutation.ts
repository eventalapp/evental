import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { useMutation, UseMutationResult, useQueryClient } from 'react-query';
import { EditUserPayload } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PasswordlessUser } from '../../utils/stripUserPassword';

export interface UseEditUserMutationData {
	editUserMutation: UseMutationResult<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		EditUserPayload
	>;
}

export const useEditUserMutation = (uid: string): UseEditUserMutationData => {
	const queryClient = useQueryClient();

	const editUserMutation = useMutation<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse, unknown>,
		EditUserPayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.User>>(`/api/users/`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('User edited successfully');

				void queryClient.refetchQueries(['user', uid]);
				void queryClient.refetchQueries(['user']);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { editUserMutation };
};
