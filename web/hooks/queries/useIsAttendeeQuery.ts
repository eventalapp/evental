import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useQuery } from 'react-query';

export interface UseIsAttendeeQueryData {
	isAttendee: boolean | undefined;
	isAttendeeLoading: boolean;
}

export const useIsAttendeeQuery = (eid: string, initialData?: boolean): UseIsAttendeeQueryData => {
	const { data: isAttendee, isLoading: isAttendeeLoading } = useQuery<
		boolean,
		AxiosError<ErroredAPIResponse>
	>(
		['isAttendee', eid],
		async () => {
			return axios
				.get<SuccessAPIResponse<boolean>>(`/api/events/${eid}/attendee`)
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

	return { isAttendee, isAttendeeLoading };
};
