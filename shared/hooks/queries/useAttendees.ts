import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseAttendeesArgs {
	eid?: string;
}

export const useAttendees = (args: UseAttendeesArgs = {}) => {
	const { eid } = args;

	return useQuery<AttendeeWithUser[], ErroredAPIResponse>(
		['attendees', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(`/events/${eid}/attendees`)
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
