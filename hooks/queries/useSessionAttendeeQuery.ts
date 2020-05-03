import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

export interface UseSessionAttendeeQueryData {
	sessionAttendeeQuery: UseQueryResult<
		AttendeeWithUser | undefined,
		AxiosError<ErroredAPIResponse>
	>;
}

export const useSessionAttendeeQuery = (
	eid: string,
	sid: string,
	uid: string,
	initialData?: AttendeeWithUser | undefined
): UseSessionAttendeeQueryData => {
	const sessionAttendeeQuery = useQuery<
		AttendeeWithUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['attendee', eid, sid, uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser>>(
					`/api/events/${eid}/sessions/${sid}/attendees/${uid}`
				)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					if (err?.response?.status === 404) {
						return err.response.data.data ?? undefined;
					}
				});
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				sid !== undefined &&
				uid !== undefined &&
				uid !== 'undefined' &&
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '' &&
				uid !== '',
			initialData
		}
	);

	return { sessionAttendeeQuery };
};
