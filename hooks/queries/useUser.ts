import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { PasswordlessUser } from '../../utils/api';
import { toast } from 'react-toastify';
import { ErroredAPIResponse } from 'nextkit';

export interface UseUserData {
	user: PasswordlessUser | undefined;
	isUserLoading: boolean;
}

export const useUser = (initialData?: PasswordlessUser | undefined): UseUserData => {
	const { data: user, isLoading: isUserLoading } = useQuery<
		PasswordlessUser,
		AxiosError<ErroredAPIResponse>
	>(
		['user'],
		async () => {
			return await axios.get<PasswordlessUser>(`/api/auth/user`).then((res) => res.data);
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
