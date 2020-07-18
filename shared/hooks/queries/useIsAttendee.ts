import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseIsAttendeeArgs {
	eid?: string;
}

export const useIsAttendee = (args: UseIsAttendeeArgs = {}) => {
	const { eid } = args;

	return useQuery<boolean, ErroredAPIResponse>(
		['isAttendee', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<boolean>>(`/events/${eid}/attendee`)
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
