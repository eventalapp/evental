import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../types';

export interface UseSessionRoleAttendeesOptions {
	eid?: string;
	sid?: string;
}

export const useSessionRoleAttendees = (args: UseSessionRoleAttendeesOptions = {}) => {
	const { eid, sid } = args;

	return useQuery<AttendeeWithUser[] | undefined, ErroredAPIResponse>(
		['role-attendees', eid, sid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/events/${eid}/sessions/${sid}/attendees?type=ROLE`
				)
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
