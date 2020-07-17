import Prisma from '@eventalapp/shared/db';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

export interface UseUserData {
	notificationPreferences: Prisma.NotificationPreference | undefined;
	isNotificationPreferencesLoading: boolean;
}

export const useNotificationPreferences = (
	initialData?: Prisma.NotificationPreference | undefined
): UseUserData => {
	const { data: notificationPreferences, isLoading: isNotificationPreferencesLoading } = useQuery<
		Prisma.NotificationPreference | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['notification-preference'],
		async () => {
			return await axios
				.get<SuccessAPIResponse<Prisma.NotificationPreference>>(`/api/user/notifications`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					if (err?.response?.status === 401) {
						return err.response.data.data ?? undefined;
					}
				});
		},
		{
			retry: 0,
			onError: (error) => {
				if (error?.response?.data?.status !== 401) {
					toast.error(error?.response?.data.message ?? 'An error has occurred.');
				}
			},
			initialData
		}
	);

	return { notificationPreferences, isNotificationPreferencesLoading };
};
