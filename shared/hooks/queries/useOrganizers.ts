import { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { api } from '../../api';
import { AttendeeWithUser } from '../../utils';

export interface UseOrganizersArgs {
	eid?: string;
}

export const useOrganizers = (args: UseOrganizersArgs = {}) => {
	const { eid } = args;

	return useQuery<AttendeeWithUser[], ErroredAPIResponse>(
		['organizers', eid],
		async () => {
			return api
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(`/events/${eid}/admin/organizers`)
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
