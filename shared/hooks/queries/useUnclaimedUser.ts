import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { FullUser } from '../../utils';

export interface UseUnclaimedUserArgs {
	eid?: string;
	uid?: string;
}

export const useUnclaimedUser = (args: UseUnclaimedUserArgs = {}) => {
	const { eid, uid } = args;

	return useQuery<FullUser | undefined, ErroredAPIResponse>(
		['full-user', uid],
		async () => {
			return await api
				.get<SuccessAPIResponse<FullUser>>(`/events/${eid}/admin/attendees/${uid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(uid)
		}
	);
};
