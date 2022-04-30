import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { PasswordlessUser } from '../../utils/api';
import { toast } from 'react-toastify';
import { NextkitError } from 'nextkit';

export interface UseActivitiesQueryData {
	user: PasswordlessUser | undefined;
	isUseSessionLoading: boolean;
}

export const useSession = (
	eid: string,
	initialData?: PasswordlessUser | undefined
): UseActivitiesQueryData => {
	const { data: user, isLoading: isUseSessionLoading } = useQuery<
		PasswordlessUser,
		AxiosError<NextkitError>
	>(
		['activities', eid],
		async () => {
			return await axios.get<PasswordlessUser>(`/api/auth/user`).then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			onError: (error) => {
				toast.error(error.message);
			},
			initialData
		}
	);

	return { user, isUseSessionLoading };
};
