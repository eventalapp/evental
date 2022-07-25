import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseSessionAttendeeArgs {
	eid?: string;
	sid?: string;
	uid?: string;
}

export const useSessionAttendee = (args: UseSessionAttendeeArgs = {}) => {
	const { eid, sid, uid } = args;

	return useQuery<AttendeeWithUser | undefined, ErroredAPIResponse>(
		['attendee', eid, sid, uid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser>>(
					`/events/${eid}/sessions/${sid}/attendees/${uid}`
				)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(sid) && Boolean(uid)
		}
	);
};
