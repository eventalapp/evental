import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { NextkitError } from 'nextkit';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeQueryData {
	attendee: EventAttendeeUser | undefined;
	isAttendeeLoading: boolean;
	attendeeError: NextkitError | null;
}

export const useAttendeeQuery = (
	eid: string,
	aid: string,
	initialData?: EventAttendeeUser | undefined
): UseAttendeeQueryData => {
	const [error, setError] = useState<NextkitError | null>(null);

	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<
		EventAttendeeUser,
		AxiosError<NextkitError>
	>(
		['attendee', eid, aid],
		async () => {
			return axios
				.get<EventAttendeeUser>(`/api/events/${eid}/attendees/${aid}`)
				.then((res) => res.data);
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
