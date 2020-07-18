import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';

export interface UseIsSessionAttendeeArgs {
	eid?: string;
	sid?: string;
}

export const useIsSessionAttendee = (args: UseIsSessionAttendeeArgs = {}) => {
	const { eid, sid } = args;

	return useQuery<boolean, ErroredAPIResponse>(
		['isSessionAttendee', eid, sid],
		async () => {
			return api
				.get<SuccessAPIResponse<boolean>>(`/events/${eid}/sessions/${sid}/attendee`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(sid)
		}
	);
};
