import axios, { AxiosError } from 'axios';
import { useQuery, UseQueryResult } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

export interface UseSessionRoleAttendeesQueryData {
	sessionRoleAttendeesQuery: UseQueryResult<
		AttendeeWithUser[] | undefined,
		AxiosError<ErroredAPIResponse>
	>;
}

export const useSessionRoleAttendeesQuery = (
	eid: string,
	sid: string,
	initialData?: AttendeeWithUser[] | undefined
): UseSessionRoleAttendeesQueryData => {
	const sessionRoleAttendeesQuery = useQuery<
		AttendeeWithUser[] | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['role-attendees', eid, sid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/api/events/${eid}/sessions/${sid}/attendees?type=ROLE`
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
				sid !== 'undefined' &&
				eid !== '' &&
				sid !== '',
			initialData
		}
	);

	return { sessionRoleAttendeesQuery };
};
