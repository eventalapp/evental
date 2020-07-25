import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { NotificationPreferencePayload } from '../../utils';

interface UseUserSettingsArgs {
	onError?: (
		error: ErroredAPIResponse | undefined,
		variables: NotificationPreferencePayload,
		context: unknown
	) => void;
	onSuccess?: (
		data: Prisma.NotificationPreference,
		variables: NotificationPreferencePayload,
		context: unknown
	) => void;
}

export const useEditNotificationPreferences = (args: UseUserSettingsArgs = {}) => {
	const { onError, onSuccess } = args;

	const queryClient = useQueryClient();

	return useMutation<
		Prisma.NotificationPreference,
		ErroredAPIResponse,
		NotificationPreferencePayload
	>(
		async (data) => {
			return await api
				.put<SuccessAPIResponse<Prisma.NotificationPreference>>(`/user/notifications`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: (...rest) => {
				void queryClient.refetchQueries(['notification-preference']);

				onSuccess?.(...rest);
			},
			onError
		}
	);
};
