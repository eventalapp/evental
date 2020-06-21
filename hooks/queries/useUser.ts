import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { PasswordlessUser } from '../../utils/stripUserPassword';

export interface UseUserData {
	user: PasswordlessUser | undefined;
	isUserLoading: boolean;
}

export const useUser = (initialData?: PasswordlessUser | undefined): UseUserData => {
	const { data: user, isLoading: isUserLoading } = useQuery<
		PasswordlessUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['user'],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PasswordlessUser>>(`/api/auth/user`)
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

	return { user, isUserLoading };
};
