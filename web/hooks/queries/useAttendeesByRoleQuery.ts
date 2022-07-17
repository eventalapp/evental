import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export interface UseAttendeesByRoleQueryData {
	attendeesData: AttendeeWithUser[] | undefined;
	isAttendeesLoading: boolean;
}

export interface UseAttendeesByRoleQueryOptions {
	initialData?: AttendeeWithUser[] | undefined;
}

export const useAttendeesByRoleQuery = (
	eid: string,
	rid: string,
	args: UseAttendeesByRoleQueryOptions = {}
): UseAttendeesByRoleQueryData => {
	const { initialData } = args;
	let params = new URLSearchParams();

	params.append('role', String(rid));

	const { data: attendeesData, isLoading: isAttendeesLoading } = useQuery<
		AttendeeWithUser[],
		AxiosError<ErroredAPIResponse>
	>(
		['attendees-role', eid, rid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/api/events/${eid}/attendees?${params.toString()}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);

	return { attendeesData, isAttendeesLoading };
};
