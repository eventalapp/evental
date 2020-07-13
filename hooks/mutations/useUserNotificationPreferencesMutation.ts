import type Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { UserNotificationPreferencePayload } from '../../utils/schemas';

export interface UseUserSettingsMutationData {
	userNotificationPreferenceMutation: UseMutationResult<
		Prisma.NotificationPreference,
		AxiosError<ErroredAPIResponse, unknown>,
		UserNotificationPreferencePayload
	>;
}

export const useUserNotificationPreferencesMutation = (): UseUserSettingsMutationData => {
	const queryClient = useQueryClient();

	const userNotificationPreferenceMutation = useMutation<
		Prisma.NotificationPreference,
		AxiosError<ErroredAPIResponse, unknown>,
		UserNotificationPreferencePayload
	>(
		async (data) => {
			return await axios
				.put<SuccessAPIResponse<Prisma.NotificationPreference>>(`/api/user/notifications`, data)
				.then((res) => res.data.data);
		},
		{
			onSuccess: () => {
				toast.success('Notification preferences saved successfully');

				void queryClient.refetchQueries(['notification-preference']);
			},
			onError: (error) => {
				toast.error(error?.response?.data.message ?? 'An error has occurred.');
			}
		}
	);

	return { userNotificationPreferenceMutation };
};
