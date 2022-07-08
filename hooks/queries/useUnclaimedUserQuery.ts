import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import { FullUser } from '../../utils/user';

export interface UseUnclaimedUserQueryData {
	unclaimedUser: FullUser | undefined;
	isUnclaimedUserLoading: boolean;
}

export const useUnclaimedUserQuery = (
	eid: string,
	uid: string,
	initialData?: FullUser | undefined
): UseUnclaimedUserQueryData => {
	const { data: unclaimedUser, isLoading: isUnclaimedUserLoading } = useQuery<
		FullUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['full-user', uid],
		async () => {
			return await axios
				.get<SuccessAPIResponse<FullUser>>(`/api/events/${eid}/admin/attendees/${uid}/user`)
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

	return { unclaimedUser, isUnclaimedUserLoading };
};
