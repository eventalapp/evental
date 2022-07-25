import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseAttendeeArgs {
	eid?: string;
	uid?: string;
}

export const useAttendee = (args: UseAttendeeArgs = {}) => {
	const { eid, uid } = args;

	return useQuery<AttendeeWithUser | undefined, ErroredAPIResponse>(
		['attendee', eid, uid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser>>(`/events/${eid}/attendees/${uid}`)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(uid)
		}
	);
};
