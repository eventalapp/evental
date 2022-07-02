import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseQueryResult, useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/stripUser';

export interface UseSessionRoleAttendeesQueryData {
	sessionRoleAttendeesQuery: UseQueryResult<
		AttendeeWithUser[] | undefined,
		AxiosError<ErroredAPIResponse>
	>;
}

export interface UseSessionRoleAttendeesOptions {
	initialData?: AttendeeWithUser[] | undefined;
}

export const useSessionRoleAttendeesQuery = (
	eid: string,
	sid: string,
	args: UseSessionRoleAttendeesOptions = {}
): UseSessionRoleAttendeesQueryData => {
	const { initialData } = args;

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
