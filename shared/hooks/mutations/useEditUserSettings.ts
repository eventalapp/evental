import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { StrippedUser, UserSettingsPayload, populateFormData } from '../../utils';

interface UseUserSettingsArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: UserSettingsPayload,
		context: unknown
	) => void;
	onSuccess?: (data: StrippedUser, variables: UserSettingsPayload, context: unknown) => void;
}

export const useEditUserSettings = (args: UseUserSettingsArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<StrippedUser, ErroredAPIResponse, UserSettingsPayload>(
		async (data) => {
			const formData = populateFormData(data);

			return await api
				.put<SuccessAPIResponse<Prisma.User>>(`/user/`, formData)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (data, ...rest) => {
				void queryClient.refetchQueries(['user', data.slug]);
				void queryClient.refetchQueries(['user']);

				onSuccess?.(data, ...rest);
			},
			onError
		}
	);
};
