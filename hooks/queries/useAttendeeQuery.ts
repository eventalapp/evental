import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ErroredAPIResponse, SuccessAPIResponse } from 'nextkit';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeQueryData {
	attendee: EventAttendeeUser | undefined;
	isAttendeeLoading: boolean;
	attendeeError: ErroredAPIResponse | null;
}

export const useAttendeeQuery = (
	eid: string,
	aid: string,
	initialData?: EventAttendeeUser | undefined
): UseAttendeeQueryData => {
	const [error, setError] = useState<ErroredAPIResponse | null>(null);

	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<
		EventAttendeeUser,
		AxiosError<ErroredAPIResponse>
	>(
		['attendee', eid, aid],
		async () => {
			return axios
				.get<SuccessAPIResponse<EventAttendeeUser>>(`/api/events/${eid}/attendees/${aid}`)
				.then((res) => res.data.data);
		},
		{
			retry: 0,
			enabled:
				eid !== undefined &&
				eid !== 'undefined' &&
				aid !== undefined &&
				aid !== 'undefined' &&
				eid !== '' &&
				aid !== '',
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
