import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { EventAttendeeUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeQueryData {
	attendee: EventAttendeeUser | undefined;
	isAttendeeLoading: boolean;
	attendeeError: ServerErrorPayload | null;
}

export const useAttendeeQuery = (
	eid: string,
	aid: string,
	initialData?: EventAttendeeUser | undefined
): UseAttendeeQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<
		EventAttendeeUser,
		AxiosError<ServerError>
	>(
		['attendee', eid, aid],
		async () => {
			return axios
				.get<EventAttendeeUser>(`/api/events/${eid}/attendees/${aid}`)
				.then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && aid !== undefined && aid !== 'undefined',
			onError: (error) => {
				setError(error.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			},
			initialData
		}
	);

	return { attendee, isAttendeeLoading, attendeeError: error };
};
