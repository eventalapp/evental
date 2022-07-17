import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseQueryResult, useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export interface UseSessionAttendeesQueryData {
	sessionAttendeesQuery: UseQueryResult<
		AttendeeWithUser[] | undefined,
		AxiosError<ErroredAPIResponse>
	>;
}

export const useSessionAttendeesQuery = (
	eid: string,
	sid: string,
	initialData?: AttendeeWithUser[] | undefined
): UseSessionAttendeesQueryData => {
	const sessionAttendeesQuery = useQuery<
		AttendeeWithUser[] | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['attendees', eid, sid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/api/events/${eid}/sessions/${sid}/attendees?type=ATTENDEE`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				sid !== undefined &&
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '',
			initialData
		}
	);

	return { sessionAttendeesQuery };
};