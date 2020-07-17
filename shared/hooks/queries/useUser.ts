import * as Prisma from '@prisma/client';
import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export type FullUser = Omit<Prisma.User, 'password'>;

export const useUser = () => {
	return useQuery<FullUser | undefined, ErroredAPIResponse | undefined>(['user'], async () => {
		return await api
			.get<SuccessAPIResponse<FullUser>>(`/user`)
			.then((res) => res.data.data)
			.catch((err: AxiosError<ErroredAPIResponse, any>) => {
				throw err.response?.data;
			});
	});
};
