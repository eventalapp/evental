import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

export interface UseIsSessionAttendeeQueryData {
	isSessionAttendee: boolean | undefined;
	isSessionAttendeeLoading: boolean;
}

export interface UseIsSessionAttendeeQueryOptions {
	initialData?: boolean;
}

export const useIsSessionAttendeeQuery = (
	eid: string,
	sid: string,
	options: UseIsSessionAttendeeQueryOptions = {}
): UseIsSessionAttendeeQueryData => {
	const { initialData } = options;

	const { data: isSessionAttendee, isLoading: isSessionAttendeeLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isSessionAttendee', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<boolean>>(`/api/events/${eid}/sessions/${sid}/attendee`)
				.then((res) => res.data.data)
				.catch(() => {
					return false;
				});
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined',
			initialData
		}
	);

	return { isSessionAttendee, isSessionAttendeeLoading };
};
