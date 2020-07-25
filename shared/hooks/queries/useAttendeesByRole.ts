import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseAttendeesByRoleArgs {
	eid?: string;
	rid?: string;
}

export const useAttendeesByRole = (args: UseAttendeesByRoleArgs = {}) => {
	const { eid, rid } = args;
	let params = new URLSearchParams();

	params.append('role', String(rid));

	return useQuery<AttendeeWithUser[], ErroredAPIResponse>(
		['attendees-role', eid, rid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/events/${eid}/attendees?${params.toString()}`
				)
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
