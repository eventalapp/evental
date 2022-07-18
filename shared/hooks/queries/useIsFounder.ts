import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseIsFounderArgs {
	eid?: string;
}

export const useIsFounder = (args: UseIsFounderArgs = {}) => {
	const { eid } = args;

	return useQuery<boolean, ErroredAPIResponse>(
		['isFounder', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<boolean>>(`/events/${eid}/founder`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid)
		}
	);
};
