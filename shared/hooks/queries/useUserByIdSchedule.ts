import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { SessionWithVenueEvent } from '../../utils';

export interface UseUserByIdScheduleArgs {
	uid?: string;
}

export const useUserByIdSchedule = (args: UseUserByIdScheduleArgs = {}) => {
	const { uid } = args;

	let params = new URLSearchParams();

	params.append('user', String(uid));

	return useQuery<SessionWithVenueEvent[], ErroredAPIResponse>(
		['user-sessions', uid],
		async () => {
			return await api
				.get<SuccessAPIResponse<SessionWithVenueEvent[]>>(`/user/${uid}/sessions?${params}`)
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
