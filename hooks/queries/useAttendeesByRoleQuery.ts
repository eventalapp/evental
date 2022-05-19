import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { PaginatedAttendeesWithUser } from '../../pages/api/events/[eid]/attendees';

export interface UseAttendeesByRoleQueryData {
	attendeesData: PaginatedAttendeesWithUser | undefined;
	isAttendeesLoading: boolean;
}

export interface UseAttendeesByRoleQueryOptions {
	initialData?: PaginatedAttendeesWithUser | undefined;
	page?: number;
}

export const useAttendeesByRoleQuery = (
	eid: string,
	rid: string,
	args: UseAttendeesByRoleQueryOptions = {}
): UseAttendeesByRoleQueryData => {
	const { initialData, page = 1 } = args;
	let params = new URLSearchParams();

	params.append('page', String(page));
	params.append('role', String(rid));

	const { data: attendeesData, isLoading: isAttendeesLoading } = useQuery<
		PaginatedAttendeesWithUser,
		AxiosError<ErroredAPIResponse>
	>(
		['attendees-role', eid, rid, page],
		async () => {
			return axios
				.get<SuccessAPIResponse<PaginatedAttendeesWithUser>>(
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
