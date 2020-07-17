import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { FullUser } from '../../utils/user';

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
			return await axios
				.get<SuccessAPIResponse<FullUser>>(`/api/user`)
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
