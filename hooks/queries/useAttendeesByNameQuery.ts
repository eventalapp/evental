import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { UseQueryResult, useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export type UseAttendeesByNameQueryData = UseQueryResult<
	AttendeeWithUser[],
	AxiosError<ErroredAPIResponse>
>;

export interface UseAttendeesByNameQueryOptions {
	initialData?: AttendeeWithUser[] | undefined;
	limit?: number;
}

export const useAttendeesByNameQuery = (
	eid: string,
	name: string,
	args: UseAttendeesByNameQueryOptions = {}
): UseAttendeesByNameQueryData => {
	const { initialData, limit } = args;
	let params = new URLSearchParams();

	params.append('name', String(name));
	params.append('limit', String(limit));
	params.append('type', 'name');

	return useQuery<AttendeeWithUser[], AxiosError<ErroredAPIResponse>>(
		['attendees-by-name', eid, name],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/api/events/${eid}/attendees?${params.toString()}`
				)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined && eid !== 'undefined' && name !== undefined && name !== 'undefined',
			initialData
		}
	);
};
