import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { populateFormData } from '../../utils/form';
import { UserSettingsPayload } from '../../utils/schemas';
import { StrippedUser } from '../../utils/user';

export interface UseUserSettingsMutationData {
	userSettingsMutation: UseMutationResult<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		UserSettingsPayload
	>;
}

export const useUserSettingsMutation = (uid: string): UseUserSettingsMutationData => {
	const queryClient = useQueryClient();

	const userSettingsMutation = useMutation<
		StrippedUser,
		AxiosError<ErroredAPIResponse, unknown>,
		UserSettingsPayload
	>(
		async (data) => {
			const formData = populateFormData(data);

			return await axios
				.put<SuccessAPIResponse<Prisma.User>>(`/api/users/test/test/`, formData)
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

	return { userSettingsMutation };
};
