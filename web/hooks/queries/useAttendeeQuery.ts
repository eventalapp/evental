import axios, { AxiosError } from 'axios';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { useState } from 'react';
import { useQuery } from 'react-query';

import { AttendeeWithUser } from '../../utils/user';

export interface UseAttendeeQueryData {
	attendee: AttendeeWithUser | undefined;
	isAttendeeLoading: boolean;
	attendeeError: ErroredAPIResponse | null;
}

export const useAttendeeQuery = (
	eid: string,
	uid: string,
	initialData?: AttendeeWithUser | undefined
): UseAttendeeQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<
		AttendeeWithUser | undefined,
		AxiosError<ErroredAPIResponse>
	>(
		['attendee', eid, uid],
		async () => {
			return axios
				.get<SuccessAPIResponse<AttendeeWithUser>>(`/api/events/${eid}/attendees/${uid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				uid !== undefined &&
				uid !== 'undefined' &&
				eid !== '' &&
				uid !== '',
			onError: (error) => {
				setError(error?.response?.data ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { attendee, isAttendeeLoading, attendeeError: error };
};