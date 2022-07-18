import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../types';

export interface UseSessionsByVenueArgs {
	eid?: string;
	sid?: string;
}

export const useSessionAttendees = (args: UseSessionsByVenueArgs = {}) => {
	const { eid, sid } = args;

	return useQuery<AttendeeWithUser[] | undefined, ErroredAPIResponse>(
		['attendees', eid, sid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/events/${eid}/sessions/${sid}/attendees?type=ATTENDEE`
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