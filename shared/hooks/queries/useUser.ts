import * as Prisma from '@prisma/client';
import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export type FullUser = Omit<Prisma.User, 'password'>;

export interface UseUserData {
	user: FullUser | undefined;
	isUserLoading: boolean;
}

export const useUser = (initialData?: FullUser | undefined): UseUserData => {
	const { data: user, isLoading: isUserLoading } = useQuery<
		FullUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['user'],
		async () => {
			return await api
				.get<SuccessAPIResponse<FullUser>>(`/user`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					if (err?.response?.status === 401) {
						return err.response.data.data ?? undefined;
					}
				});
		},
		{
			retry: 0,
			onError: (error) => {},
			initialData
		}
	);

	return { user, isUserLoading };
};
