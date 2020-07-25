import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseAttendeesByNameArgs {
	limit?: number;
	eid?: string;
	name?: string;
}

export const useAttendeesByName = (args: UseAttendeesByNameArgs = {}) => {
	const { limit, eid, name } = args;
	let params = new URLSearchParams();

	params.append('name', String(name));
	params.append('limit', String(limit));
	params.append('type', 'name');

	return useQuery<AttendeeWithUser[], ErroredAPIResponse>(
		['attendees-by-name', eid, name],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(
					`/events/${eid}/attendees?${params.toString()}`
				)
				.then((res) => res.data.data)
				.catch((err: AxiosError<ErroredAPIResponse>) => {
					throw err.response?.data;
				});
		},
		{
			retry: 0,
			enabled: Boolean(eid) && Boolean(name)
		}
	);
};
