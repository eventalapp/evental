import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export const useNotificationPreferences = () => {
	return useQuery<Prisma.NotificationPreference | undefined, ErroredAPIResponse>(
		['notification-preference'],
		async () => {
			return await api
				.get<SuccessAPIResponse<Prisma.NotificationPreference>>(`/user/notifications`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0
		}
	);
};
