import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { StrippedUser } from '../../utils';

export interface UseUserByIdArgs {
	uid?: string;
}

export const useUserById = (args: UseUserByIdArgs = {}) => {
	const { uid } = args;

	return useQuery<StrippedUser | undefined, ErroredAPIResponse>(
		['user', uid],
		async () => {
			return await api
				.get<SuccessAPIResponse<StrippedUser>>(`/user/${uid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(uid)
		}
	);
};
