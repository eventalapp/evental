import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { PasswordlessUser } from '../../utils/stripUserPassword';

export interface UseUserQueryData {
	user: PasswordlessUser | undefined;
	isUserLoading: boolean;
}

export const useUserQuery = (
	uid: string,
	initialData?: PasswordlessUser | undefined
): UseUserQueryData => {
	const { data: user, isLoading: isUserLoading } = useQuery<
		PasswordlessUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['user', uid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<PasswordlessUser>>(`/api/users/${uid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: uid !== undefined && uid !== 'undefined' && uid !== '',
			onError: (error) => {
				if (error?.response?.data?.status !== 401 && error?.response?.data?.status !== 404) {
					toast.error(error?.response?.data.message ?? 'An error has occurred.');
				}
			},
			initialData
		}
	);

	return { user, isUserLoading };
};
