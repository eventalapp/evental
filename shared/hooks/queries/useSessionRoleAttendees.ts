import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseSessionRoleAttendeesArgs {
	eid?: string;
	sid?: string;
}

export const useSessionRoleAttendees = (args: UseSessionRoleAttendeesArgs = {}) => {
	const { eid, sid } = args;

	return useQuery<AttendeeWithUser[], ErroredAPIResponse>(
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
