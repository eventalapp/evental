import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseIsOrganizerArgs {
	eid?: string;
}

export const useIsOrganizer = (args: UseIsOrganizerArgs = {}) => {
	const { eid } = args;

	return useQuery<boolean, ErroredAPIResponse>(
		['isOrganizer', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<boolean>>(`/events/${eid}/organizer`)
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
