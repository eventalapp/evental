import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { ServerError, ServerErrorPayload } from '../../typings/error';
import { EventMemberUser } from '../../pages/api/events/[eid]/attendees/[aid]';

export interface UseAttendeeQueryData {
	attendee: EventMemberUser | undefined;
	isAttendeeLoading: boolean;
	attendeeError: ServerErrorPayload | null;
}

export const useAttendeeQuery = (eid: string, aid: string): UseAttendeeQueryData => {
	const [error, setError] = useState<ServerErrorPayload | null>(null);

	const { data: attendee, isLoading: isAttendeeLoading } = useQuery<
		EventMemberUser,
		AxiosError<ServerError>
	>(
		['attendee', eid, aid],
		async () => {
			return axios
				.get<EventMemberUser>(`/api/events/${eid}/attendees/${aid}`)
				.then((res) => res.data);
		},
		{
			retry: 0,
			enabled: eid !== undefined && eid !== 'undefined' && aid !== undefined && aid !== 'undefined',
			onError: (err) => {
				setError(err.response?.data.error ?? null);
			},
			onSuccess: () => {
				setError(null);
			}
		}
	);

	return { attendee, isAttendeeLoading, attendeeError: error };
};
