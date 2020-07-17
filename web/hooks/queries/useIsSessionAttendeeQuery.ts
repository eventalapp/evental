import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

export interface UseIsSessionAttendeeQueryData {
	isSessionAttendee: boolean | undefined;
	isSessionAttendeeLoading: boolean;
}

export interface UseIsSessionAttendeeQueryOptions {
	initialData?: boolean;
	keepPreviousData?: boolean;
}

export const useIsSessionAttendeeQuery = (
	eid: string,
	sid: string,
	options: UseIsSessionAttendeeQueryOptions = {}
): UseIsSessionAttendeeQueryData => {
	const { initialData, keepPreviousData = false } = options;

	const { data: isSessionAttendee, isLoading: isSessionAttendeeLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isSessionAttendee', eid, sid],
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
			initialData,
			keepPreviousData
		}
	);

	return { isSessionAttendee, isSessionAttendeeLoading };
};
