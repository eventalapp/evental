import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export interface UseOrganizersQueryData {
	organizers: AttendeeWithUser[] | undefined;
	isOrganizersLoading: boolean;
}

export const useOrganizersQuery = (
	eid: string,
	initialData?: AttendeeWithUser[] | undefined
): UseOrganizersQueryData => {
	const { data: organizers, isLoading: isOrganizersLoading } = useQuery<
		AttendeeWithUser[],
		AxiosError<ErroredAPIResponse>
	>(
		['organizers', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser[]>>(`/api/events/${eid}/admin/organizers`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);

	return { organizers, isOrganizersLoading };
};
