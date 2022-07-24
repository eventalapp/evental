import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../api';
import { NotificationPreferencePayload } from '../../utils/schema';

export const useEditNotificationPreferences = () => {
	const queryClient = useQueryClient();

	return useMutation<
		Prisma.NotificationPreference,
		AxiosError<ErroredAPIResponse, unknown>,
		NotificationPreferencePayload
	>(
		async (data) => {
			return await api
				.put<SuccessAPIResponse<Prisma.NotificationPreference>>(`/user/notifications`, data)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse, any>) => {
					throw err.response?.data;
				});
		},
		{
			onSuccess: () => {
				Alert.alert(
					'Preferences Updated',
					'Your user notification preferences have succesfully been updated.',
					[{ text: 'OK' }]
				);
				void queryClient.refetchQueries(['notification-preference']);
			},
			onError: (error) => {
				Alert.alert('Error', error?.message, [{ text: 'OK' }]);
			}
		}
	);
};
